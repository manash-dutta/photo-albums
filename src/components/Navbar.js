import style from "./Navbar.module.css"
import icon from "../assets/album-logo.png"

export default function Navbar() {
  return (
    <nav className={style.container}>
      <div className={style.logoContainer}>
        <img src={icon} className={style.logo} alt="logo" />
        <h2>PhotoFolio</h2>
      </div>
    </nav>
  )
}