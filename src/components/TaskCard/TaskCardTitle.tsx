interface TaskCardTitleProps {
  title: string;
  description: string;
}
const TaskCardTitle = ({
  title,
  description
}: TaskCardTitleProps) => {
  return <div className="my-[5px] mx-0 px-0">
      <h4 style={{
      fontSize: '14px',
      fontWeight: 700,
      color: '#000000',
      marginBottom: '2px',
      lineHeight: 1.2,
      fontFamily: 'IBM Plex Sans Arabic'
    }} className="text-right mx-[25px] font-bold text-xl">
        {title}
      </h4>
      
      <p style={{
      fontSize: '10px',
      fontWeight: 400,
      color: '#858789',
      marginBottom: '0px',
      lineHeight: 1.2,
      fontFamily: 'IBM Plex Sans Arabic'
    }} className="text-right mx-[25px] text-soabra-secondary text-base font-normal my-[5px]">
        {description}
      </p>
    </div>;
};
export default TaskCardTitle;