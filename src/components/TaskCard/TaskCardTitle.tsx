interface TaskCardTitleProps {
  title: string;
  description: string;
}
const TaskCardTitle = ({
  title,
  description
}: TaskCardTitleProps) => {
  return <div>
      <h4 style={{
      fontSize: '14px',
      fontWeight: 700,
      color: '#000000',
      marginBottom: '2px',
      lineHeight: 1.2,
      fontFamily: 'IBM Plex Sans Arabic'
    }} className="text-right mx-[25px] text-lg font-bold">
        {title}
      </h4>
      
      <p style={{
      fontSize: '10px',
      fontWeight: 400,
      color: '#858789',
      marginBottom: '0px',
      lineHeight: 1.2,
      fontFamily: 'IBM Plex Sans Arabic'
    }} className="text-right mx-[25px] font-extralight text-[soabra-text-primary] text-soabra-secondary">
        {description}
      </p>
    </div>;
};
export default TaskCardTitle;