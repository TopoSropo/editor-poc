"use client";
import styles from "./page.module.scss";

export default function Poc() {
  return (
    <div className={styles.foo}>
      <div>
        <button>view</button>
        <button>create</button>
        <button>edit</button>
      </div>
      <div>canvas</div>
    </div>
  );
}
