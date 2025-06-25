
interface TaskCardTitleProps {
  title: string;
  description: string;
}

const TaskCardTitle = ({ title, description }: TaskCardTitleProps) => {
  return (
    <div className="mx-0 px-0 my-[5px]">
      <h4 
        className="text-right font-bold mx-[25px]"
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#000000',
          marginBottom: '2px',
          lineHeight: 1.2,
          fontFamily: 'IBM Plex Sans Arabic'
        }}
      >
        {title}
      </h4>
      
      <p 
        className="text-right mx-[25px] my-[5px]"
        style={{
          fontSize: '10px',
          fontWeight: 400,
          color: '#858789',
          marginBottom: '0px',
          lineHeight: 1.2,
          fontFamily: 'IBM Plex Sans Arabic'
        }}
      >
        {description}
      </p>
    </div>
  );
};

export default TaskCardTitle;
