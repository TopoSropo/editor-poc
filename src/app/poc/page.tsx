"use client";
import { useState } from "react";
import styles from "./page.module.scss";

type Mode = "view" | "create" | "edit";

type DotType = "route" | "ring" | "tooltip";

export default function Poc() {
  const [mode, setMode] = useState<Mode>("view");
  const [entityType, setEntityType] = useState<DotType>("ring");

  return (
    <div className={styles.container}>
      <div className={styles.modes}>
        modes:
        <button
          onClick={() => setMode("view")}
          style={{
            backgroundColor: mode === "view" ? "green" : "initial",
          }}
          className={styles.modeButton}
        >
          view
        </button>
        <button
          onClick={() => setMode("create")}
          style={{
            backgroundColor: mode === "create" ? "green" : "initial",
          }}
          className={styles.modeButton}
        >
          create
        </button>
        <button
          onClick={() => setMode("edit")}
          style={{
            backgroundColor: mode === "edit" ? "green" : "initial",
          }}
          className={styles.modeButton}
        >
          edit
        </button>
      </div>
      <div className={styles.modes}>
        add:
        <button
          disabled={mode !== "create"}
          onClick={() => setEntityType("route")}
          style={{
            backgroundColor:
              entityType === "route" && mode === "create" ? "green" : "initial",
          }}
          className={styles.modeButton}
        >
          route point
        </button>
        <button
          disabled={mode !== "create"}
          onClick={() => setEntityType("ring")}
          style={{
            backgroundColor:
              entityType === "ring" && mode === "create" ? "green" : "initial",
          }}
          className={styles.modeButton}
        >
          ring
        </button>
        <button
          disabled={mode !== "create"}
          onClick={() => setEntityType("tooltip")}
          style={{
            backgroundColor:
              entityType === "tooltip" && mode === "create"
                ? "green"
                : "initial",
          }}
          className={styles.modeButton}
        >
          tooltip
        </button>
      </div>

      <div>canvas</div>
    </div>
  );
}
