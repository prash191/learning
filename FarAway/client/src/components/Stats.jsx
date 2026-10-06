const Stats = ({tasks}) => {
    let packed = 0;
    tasks.forEach((task) => {
        if(task.packed === true) packed++;
    })
    const packedPercent = tasks.length === 0 ? 0 : Math.round(100*(packed/tasks.length));
  return (
    <footer className="progress-footer">
      <div className="progress-copy">
        <span className="progress-label">TRIP PROGRESS</span>
        <p>{tasks.length === 0 ? "Your next adventure starts with a list." : `${packed} of ${tasks.length} items packed`}</p>
      </div>
      <div className="progress-meter" role="progressbar" aria-label="Packing progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={packedPercent}>
        <span style={{ width: `${packedPercent}%` }} />
      </div>
      <strong className="progress-percent">{packedPercent}<span>%</span></strong>
    </footer>
  )
}

export default Stats