interface TaskCardKanbanTitleProps {
  title: string;
  description: string;
}

const TaskCardKanbanTitle = ({
  title,
  description
}: TaskCardKanbanTitleProps) => {
  return (
    <div className="mx-0 px-0 my-[1px]">
      <h4 style={{
        fontSize: '4px',
        fontWeight: 700,
        color: '#000000',
        marginBottom: '0.5px',
        lineHeight: 1.1,
        fontFamily: 'IBM Plex Sans Arabic'
      }} className="text-right font-bold mx-[2px] text-base">
        {title}
      </h4>
      
      <p style={{
        fontSize: '3px',
        fontWeight: 400,
        color: '#858789',
        marginBottom: '0px',
        lineHeight: 1.1,
        fontFamily: 'IBM Plex Sans Arabic'
      }} className="text-right my-[0.5px] mx-[2px] text-sm font-normal text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default TaskCardKanbanTitle;