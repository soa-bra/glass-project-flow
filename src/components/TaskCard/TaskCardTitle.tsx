interface TaskCardTitleProps {
  title: string;
  description: string;
}
const TaskCardTitle = ({
  title,
  description
}: TaskCardTitleProps) => {
  return <div className="mx-0 px-0 my-[5px]">
      <h4 style={{
      fontSize: '16px',
      fontWeight: 700,
      color: '#000000',
      marginBottom: '2px',
      lineHeight: 1.1,
      fontFamily: 'IBM Plex Sans Arabic'
    }} className="text-right font-bold text-base my-0 mx-[4px]">
        {title}
      </h4>
      
      <p style={{
      fontSize: '12px',
      fontWeight: 400,
      color: '#858789',
      marginBottom: '0px',
      lineHeight: 1.1,
      fontFamily: 'IBM Plex Sans Arabic'
    }} className="text-right my-[3px] text-sm font-normal text-gray-600 mx-[4px]">
        {description}
      </p>
    </div>;
};
export default TaskCardTitle;