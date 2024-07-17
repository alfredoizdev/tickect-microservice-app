import Link from "next/link";
import styles from "./Navbar.module.scss";
import useAppStore from "@/store/appStore";
import useSignOut from "@/hooks/useSignOut";
import { useEffect } from "react";

const Navbar = () => {
  const { currentUser } = useAppStore((state) => state);
  const { signOut } = useSignOut();

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <h1>My Website</h1>
        {currentUser && (
          <span className={styles.badgeUser}> {currentUser.email}</span>
        )}
      </div>
      <ul>
        <li>
          <Link href="/members/home">Home</Link>
        </li>
        <li>
          <Link href="/members/about">About</Link>
        </li>
        <li>
          <button className={styles.signoutBtn} onClick={signOut}>
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
