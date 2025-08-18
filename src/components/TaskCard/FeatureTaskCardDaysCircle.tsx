
interface FeatureTaskCardDaysCircleProps {
  daysLeft: number;
}

const FeatureTaskCardDaysCircle = ({ daysLeft }: FeatureTaskCardDaysCircleProps) => {
  return (
    <div style={{
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      border: '1px solid #000000',
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <span style={{
        fontSize: '12px',
        fontWeight: 700,
        color: '#000000',
        lineHeight: 1,
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        {daysLeft.toString().padStart(2, '0')}
      </span>
      <span style={{
        fontSize: '10px',
        fontWeight: 400,
        color: '#000000',
        marginTop: '2px',
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        يوم
      </span>
    </div>
  );
};

export default FeatureTaskCardDaysCircle;
