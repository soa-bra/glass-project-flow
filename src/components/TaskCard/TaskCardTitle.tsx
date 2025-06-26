
interface TaskCardTitleProps {
  title: string;
  description: string;
}

const TaskCardTitle = ({
  title,
  description
}: TaskCardTitleProps) => {
  return (
    <div className="mx-0 px-0 my-[5px]">
      <h4 style={{
        fontSize: '20px',
        fontWeight: 700,
        color: '#000000',
        marginBottom: '2px',
        lineHeight: 1.2,
        fontFamily: 'IBM Plex Sans Arabic'
      }} className="text-right font-bold mx-[10px] text-lg">
        {title}
      </h4>
      
      <p style={{
        fontSize: '14px',
        fontWeight: 400,
        color: '#858789',
        marginBottom: '0px',
        lineHeight: 1.2,
        fontFamily: 'IBM Plex Sans Arabic'
      }} className="text-right my-[5px] mx-[10px] text-base font-normal text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default TaskCardTitle;
