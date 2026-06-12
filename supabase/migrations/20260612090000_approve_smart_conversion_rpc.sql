CREATE OR REPLACE FUNCTION public.approve_smart_conversion(p_payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_board_id uuid;
  v_source_ids uuid[];
  v_target_type text;
  v_suggested jsonb := COALESCE(p_payload->'suggestedData', '{}'::jsonb);
  v_approval jsonb := COALESCE(p_payload->'approval', '{}'::jsonb);
  v_approved_at text;
  v_missing_ids uuid[];
  v_entity_table text;
  v_entity jsonb;
  v_entity_id uuid;
  v_project_id uuid;
  v_display_name text;
  v_smart_type text;
  v_card_content jsonb;
  v_linked_elements jsonb := '[]'::jsonb;
  v_transformation_ids uuid[] := ARRAY[]::uuid[];
  v_data_link_ids uuid[] := ARRAY[]::uuid[];
  v_sync_queue_id uuid;
  v_project_event_id uuid;
  v_audit_event_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;

  v_board_id := (p_payload->>'boardId')::uuid;
  v_target_type := p_payload->>'targetEntityType';

  IF COALESCE((v_approval->>'approved')::boolean, false) IS NOT TRUE THEN
    RAISE EXCEPTION 'Smart conversion must be approved before creating an executable record.' USING ERRCODE = '22023';
  END IF;

  IF v_target_type NOT IN ('project', 'task', 'financial_budget', 'financial_transaction') THEN
    RAISE EXCEPTION 'Unsupported smart conversion target: %', v_target_type USING ERRCODE = '22023';
  END IF;

  SELECT COALESCE(array_agg(value::uuid), ARRAY[]::uuid[])
  INTO v_source_ids
  FROM jsonb_array_elements_text(COALESCE(p_payload->'sourceElementIds', '[]'::jsonb)) AS source(value);

  IF cardinality(v_source_ids) = 0 THEN
    RAISE EXCEPTION 'sourceElementIds must contain at least one saved planning element.' USING ERRCODE = '22023';
  END IF;

  IF NOT public.user_has_board_role(v_board_id, v_user_id, 'editor'::public.board_role) THEN
    RAISE EXCEPTION 'لا تملك صلاحية اعتماد تحويلات هذه اللوحة.' USING ERRCODE = '42501';
  END IF;

  SELECT array_agg(source_id)
  INTO v_missing_ids
  FROM unnest(v_source_ids) AS source(source_id)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.planning_elements pe
    WHERE pe.id = source.source_id
      AND pe.board_id = v_board_id
  );

  IF COALESCE(cardinality(v_missing_ids), 0) > 0 THEN
    RAISE EXCEPTION 'لا يمكن اعتماد التحويل قبل حفظ كل العناصر المحددة على اللوحة.' USING ERRCODE = 'P0001';
  END IF;

  v_approved_at := COALESCE(v_approval->>'approvedAt', now()::text);
  v_approval := v_approval || jsonb_build_object(
    'approverId', COALESCE(v_approval->>'approverId', v_user_id::text),
    'approvedAt', v_approved_at
  );

  IF v_target_type = 'project' THEN
    INSERT INTO public.projects (
      name,
      description,
      state,
      priority,
      start_date,
      due_date,
      budget,
      metadata,
      owner_id
    ) VALUES (
      COALESCE(NULLIF(btrim(v_suggested->>'name'), ''), NULLIF(btrim(v_suggested->>'title'), ''), 'مشروع من الكانفس'),
      NULLIF(btrim(v_suggested->>'description'), ''),
      COALESCE(NULLIF(btrim(v_suggested->>'state'), ''), 'draft')::public.central_state,
      COALESCE(NULLIF(btrim(v_suggested->>'priority'), ''), 'medium')::public.central_priority,
      CASE WHEN NULLIF(btrim(COALESCE(v_suggested->>'start_date', v_suggested->>'startDate')), '') IS NULL THEN NULL ELSE (COALESCE(v_suggested->>'start_date', v_suggested->>'startDate'))::timestamptz END,
      CASE WHEN NULLIF(btrim(COALESCE(v_suggested->>'due_date', v_suggested->>'dueDate')), '') IS NULL THEN NULL ELSE (COALESCE(v_suggested->>'due_date', v_suggested->>'dueDate'))::timestamptz END,
      CASE WHEN NULLIF(btrim(v_suggested->>'budget'), '') IS NULL THEN NULL ELSE (v_suggested->>'budget')::numeric END,
      COALESCE(v_suggested->'metadata', '{}'::jsonb) || jsonb_build_object('smartConversion', jsonb_build_object('boardId', v_board_id, 'sourceElementIds', to_jsonb(v_source_ids), 'approvedAt', v_approved_at, 'approvalNote', v_approval->>'note')),
      v_user_id
    ) RETURNING id, to_jsonb(projects.*) INTO v_entity_id, v_entity;
    v_project_id := v_entity_id;
    v_entity_table := 'projects';
  ELSIF v_target_type = 'task' THEN
    v_project_id := COALESCE(v_suggested->>'linked_project_id', v_suggested->>'linkedProjectId', v_suggested->>'project_id')::uuid;
    IF v_project_id IS NULL THEN
      RAISE EXCEPTION 'اختر مشروعًا لربط المهمة قبل اعتماد التحويل.' USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.tasks (
      linked_project_id,
      name,
      description,
      state,
      priority,
      assignee_id,
      estimated_duration,
      estimated_cost,
      complexity,
      required_team_size,
      start_date,
      due_date,
      metadata,
      owner_id
    ) VALUES (
      v_project_id,
      COALESCE(NULLIF(btrim(v_suggested->>'name'), ''), NULLIF(btrim(v_suggested->>'title'), ''), 'مهمة من الكانفس'),
      NULLIF(btrim(v_suggested->>'description'), ''),
      COALESCE(NULLIF(btrim(v_suggested->>'state'), ''), 'draft')::public.central_state,
      COALESCE(NULLIF(btrim(v_suggested->>'priority'), ''), 'medium')::public.central_priority,
      NULLIF(btrim(COALESCE(v_suggested->>'assignee_id', v_suggested->>'assigneeId')), '')::uuid,
      COALESCE(NULLIF(btrim(COALESCE(v_suggested->>'estimated_duration', v_suggested->>'estimatedDuration')), '')::numeric, 0),
      COALESCE(NULLIF(btrim(COALESCE(v_suggested->>'estimated_cost', v_suggested->>'estimatedCost')), '')::numeric, 0),
      COALESCE(NULLIF(btrim(v_suggested->>'complexity'), ''), 'simple')::public.central_complexity,
      COALESCE(NULLIF(btrim(COALESCE(v_suggested->>'required_team_size', v_suggested->>'requiredTeamSize')), '')::integer, 1),
      CASE WHEN NULLIF(btrim(COALESCE(v_suggested->>'start_date', v_suggested->>'startDate')), '') IS NULL THEN NULL ELSE (COALESCE(v_suggested->>'start_date', v_suggested->>'startDate'))::timestamptz END,
      CASE WHEN NULLIF(btrim(COALESCE(v_suggested->>'due_date', v_suggested->>'dueDate')), '') IS NULL THEN NULL ELSE (COALESCE(v_suggested->>'due_date', v_suggested->>'dueDate'))::timestamptz END,
      COALESCE(v_suggested->'metadata', '{}'::jsonb) || jsonb_build_object('smartConversion', jsonb_build_object('boardId', v_board_id, 'sourceElementIds', to_jsonb(v_source_ids), 'approvedAt', v_approved_at, 'approvalNote', v_approval->>'note')),
      v_user_id
    ) RETURNING id, to_jsonb(tasks.*) INTO v_entity_id, v_entity;
    v_entity_table := 'tasks';
  ELSIF v_target_type = 'financial_budget' THEN
    v_project_id := NULLIF(btrim(COALESCE(v_suggested->>'project_id', v_suggested->>'projectId')), '')::uuid;
    INSERT INTO public.financial_budgets (
      project_id,
      department_id,
      name,
      period,
      start_date,
      end_date,
      planned_amount,
      spent_amount,
      currency,
      status,
      notes,
      owner_id
    ) VALUES (
      v_project_id,
      NULLIF(btrim(COALESCE(v_suggested->>'department_id', v_suggested->>'departmentId')), '')::uuid,
      COALESCE(NULLIF(btrim(v_suggested->>'name'), ''), NULLIF(btrim(v_suggested->>'title'), ''), 'ميزانية من الكانفس'),
      COALESCE(NULLIF(btrim(v_suggested->>'period'), ''), 'monthly'),
      NULLIF(btrim(COALESCE(v_suggested->>'start_date', v_suggested->>'startDate')), '')::date,
      NULLIF(btrim(COALESCE(v_suggested->>'end_date', v_suggested->>'endDate')), '')::date,
      COALESCE(NULLIF(btrim(COALESCE(v_suggested->>'planned_amount', v_suggested->>'plannedAmount', v_suggested->>'amount')), '')::numeric, 0),
      COALESCE(NULLIF(btrim(COALESCE(v_suggested->>'spent_amount', v_suggested->>'spentAmount')), '')::numeric, 0),
      COALESCE(NULLIF(btrim(v_suggested->>'currency'), ''), 'SAR'),
      COALESCE(NULLIF(btrim(v_suggested->>'status'), ''), 'draft'),
      COALESCE(NULLIF(btrim(v_suggested->>'notes'), ''), NULLIF(btrim(v_suggested->>'description'), '')),
      v_user_id
    ) RETURNING id, to_jsonb(financial_budgets.*) INTO v_entity_id, v_entity;
    v_entity_table := 'financial_budgets';
  ELSE
    v_project_id := NULLIF(btrim(COALESCE(v_suggested->>'project_id', v_suggested->>'projectId')), '')::uuid;
    INSERT INTO public.financial_transactions (
      budget_id,
      project_id,
      kind,
      amount,
      currency,
      date,
      vendor,
      category,
      notes,
      owner_id
    ) VALUES (
      NULLIF(btrim(COALESCE(v_suggested->>'budget_id', v_suggested->>'budgetId')), '')::uuid,
      v_project_id,
      CASE WHEN v_suggested->>'kind' = 'income' THEN 'income' ELSE 'expense' END,
      COALESCE(NULLIF(btrim(v_suggested->>'amount'), '')::numeric, 0),
      COALESCE(NULLIF(btrim(v_suggested->>'currency'), ''), 'SAR'),
      COALESCE(NULLIF(btrim(v_suggested->>'date'), '')::date, CURRENT_DATE),
      NULLIF(btrim(v_suggested->>'vendor'), ''),
      NULLIF(btrim(v_suggested->>'category'), ''),
      COALESCE(NULLIF(btrim(v_suggested->>'notes'), ''), NULLIF(btrim(v_suggested->>'description'), '')),
      v_user_id
    ) RETURNING id, to_jsonb(financial_transactions.*) INTO v_entity_id, v_entity;
    v_entity_table := 'financial_transactions';
  END IF;

  v_display_name := COALESCE(NULLIF(v_entity->>'name', ''), NULLIF(v_entity->>'title', ''), 'كيان تنفيذي');
  v_smart_type := CASE
    WHEN v_target_type = 'project' THEN 'project_card'
    WHEN v_target_type = 'task' THEN 'task_card'
    ELSE 'finance_card'
  END;
  v_card_content := jsonb_strip_nulls(jsonb_build_object(
    'smartType', v_smart_type,
    'linkedEntityType', v_target_type,
    'linkedEntityId', v_entity_id,
    'title', v_display_name,
    'name', v_display_name,
    'projectName', CASE WHEN v_target_type = 'project' THEN v_display_name END,
    'taskName', CASE WHEN v_target_type = 'task' THEN v_display_name END,
    'status', COALESCE(v_entity->>'state', v_entity->>'status', 'draft'),
    'state', COALESCE(v_entity->>'state', 'draft'),
    'priority', COALESCE(v_entity->>'priority', v_suggested->>'priority'),
    'description', COALESCE(v_entity->>'description', v_suggested->>'description'),
    'budget', COALESCE(v_entity->'budget', v_entity->'planned_amount'),
    'estimatedCost', v_entity->'estimated_cost',
    'dueDate', v_entity->>'due_date',
    'sourceElementIds', to_jsonb(v_source_ids)
  ));

  WITH updated AS (
    UPDATE public.planning_elements pe
    SET element_type = 'entity_card'::public.planning_element_type,
        size = jsonb_build_object('width', 320, 'height', CASE WHEN v_target_type = 'project' THEN 260 ELSE 220 END),
        metadata = COALESCE(pe.metadata, '{}'::jsonb) || jsonb_build_object(
          'canvasType', 'smart',
          'smartType', v_smart_type,
          'linkedEntityType', v_target_type,
          'linkedEntityId', v_entity_id
        ),
        content = COALESCE(pe.content, '{}'::jsonb) || v_card_content,
        updated_at = now()
    WHERE pe.board_id = v_board_id
      AND pe.id = ANY(v_source_ids)
    RETURNING pe.*
  )
  SELECT COALESCE(jsonb_agg(to_jsonb(updated.*)), '[]'::jsonb)
  INTO v_linked_elements
  FROM updated;

  WITH inserted AS (
    INSERT INTO public.element_transformations (
      board_id,
      source_element_id,
      transformation_type,
      result,
      status,
      metadata,
      created_by
    )
    SELECT
      v_board_id,
      source_id,
      v_target_type,
      jsonb_build_object('entityType', v_target_type, 'entityId', v_entity_id),
      'completed',
      jsonb_build_object('suggestedData', v_suggested, 'approval', v_approval),
      v_user_id
    FROM unnest(v_source_ids) AS source(source_id)
    RETURNING id
  )
  SELECT COALESCE(array_agg(id), ARRAY[]::uuid[])
  INTO v_transformation_ids
  FROM inserted;

  WITH inserted AS (
    INSERT INTO public.data_links (
      board_id,
      project_id,
      source_element_id,
      link_kind,
      label,
      mapping,
      metadata,
      created_by
    )
    SELECT
      v_board_id,
      v_project_id,
      source_id,
      'derivation',
      'تحويل إلى ' || v_target_type,
      jsonb_build_object('targetEntityType', v_target_type, 'targetEntityId', v_entity_id),
      jsonb_build_object('conversion', p_payload || jsonb_build_object('approval', v_approval)),
      v_user_id
    FROM unnest(v_source_ids) AS source(source_id)
    RETURNING id
  )
  SELECT COALESCE(array_agg(id), ARRAY[]::uuid[])
  INTO v_data_link_ids
  FROM inserted;

  INSERT INTO public.sync_queue (
    board_id,
    project_id,
    entity_table,
    entity_id,
    operation,
    status,
    payload,
    created_by
  ) VALUES (
    v_board_id,
    v_project_id,
    v_entity_table,
    v_entity_id,
    'planning.smart_conversion.approved',
    'pending',
    jsonb_build_object(
      'boardId', v_board_id,
      'sourceElementIds', to_jsonb(v_source_ids),
      'targetEntityType', v_target_type,
      'targetEntityId', v_entity_id,
      'approval', v_approval
    ),
    v_user_id
  ) RETURNING id INTO v_sync_queue_id;

  IF v_project_id IS NOT NULL THEN
    INSERT INTO public.project_events (
      project_id,
      board_id,
      event_kind,
      event_type,
      aggregate_type,
      aggregate_id,
      actor_id,
      payload
    ) VALUES (
      v_project_id,
      v_board_id,
      'created',
      'canvas.element.converted.' || v_target_type,
      v_target_type,
      v_entity_id,
      COALESCE((v_approval->>'approverId')::uuid, v_user_id),
      jsonb_build_object(
        'boardId', v_board_id,
        'sourceElementIds', to_jsonb(v_source_ids),
        'targetEntityType', v_target_type,
        'targetEntityId', v_entity_id
      )
    ) RETURNING id INTO v_project_event_id;
  END IF;

  INSERT INTO public.audit_events (
    actor_id,
    resource_type,
    resource_id,
    action,
    decision,
    scope_type,
    scope_id,
    metadata
  ) VALUES (
    COALESCE((v_approval->>'approverId')::uuid, v_user_id),
    v_target_type,
    v_entity_id,
    'planning.smart_conversion.approve',
    'allowed'::public.audit_decision,
    'board'::public.role_scope_type,
    v_board_id,
    jsonb_build_object(
      'boardId', v_board_id,
      'sourceElementIds', to_jsonb(v_source_ids),
      'targetEntityType', v_target_type,
      'suggestedData', v_suggested,
      'approval', v_approval
    )
  ) RETURNING id INTO v_audit_event_id;

  RETURN jsonb_build_object(
    'entity', v_entity,
    'linkedElements', v_linked_elements,
    'traceReferences', jsonb_strip_nulls(jsonb_build_object(
      'transformationIds', to_jsonb(v_transformation_ids),
      'dataLinkIds', to_jsonb(v_data_link_ids),
      'syncQueueId', v_sync_queue_id,
      'projectEventId', v_project_event_id
    )),
    'auditEventId', v_audit_event_id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.approve_smart_conversion(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_smart_conversion(jsonb) TO authenticated;
