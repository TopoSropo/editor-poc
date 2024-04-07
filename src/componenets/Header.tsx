import Link from "next/link";

export const Header = () => {
  return (
    <header>
      <nav
        style={{
          display: "flex",
          gap: "12px",
        }}
      >
        <Link href={"/"}>home</Link>
        <Link href={"/poc"}>poc</Link>
      </nav>
    </header>
  );
};
