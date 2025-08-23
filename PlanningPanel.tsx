          onSave={() => console.log('save')}
          onExport={() => console.log('export')}
          onOpen={() => console.log('open')}
          onDuplicate={() => console.log('duplicate')}
          onGenerateProject={() => console.log('ai')}
        />
        <BottomToolbar />
        <InspectorPanels />
=======
  return (
    <ToolProvider>
      <InnerPanel />
    </ToolProvider>
  );

      </div>
    </ToolProvider>
  );
}
