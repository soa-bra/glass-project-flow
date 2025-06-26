
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
      <h4 
        className="text-lg font-bold mb-1 font-arabic text-right mx-0 my-0 py-0"
        style={{
          color: '#000000',
          fontFamily: 'IBM Plex Sans Arabic'
        }}
      >
        {title}
      </h4>
      <p 
        className="font-arabic text-right px-0 py-0 mx-px my-0"
        style={{
          color: '#858789',
          fontFamily: 'IBM Plex Sans Arabic'
        }}
      >
        {description}
      </p>
    </div>
  );
};

export default TaskCardTitle;
