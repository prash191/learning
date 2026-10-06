import logo from "../assets/logo.png";
import plane from "../assets/plane.png"

const Navbar = () => {
  return (
    <header className="trip-header">
      <a className="trip-brand" href="#top" aria-label="Far Away home">
        <img className="trip-brand-mark" src={logo} alt="" />
        <span className="trip-brand-name">Far Away</span>
      </a>
      <div className="trip-header-note">
        <span className="trip-header-kicker">THE TRAVEL CHECKLIST</span>
        <img className="trip-plane" src={plane} alt="" />
      </div>
    </header>
  )
}

export default Navbar