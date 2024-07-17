"use client";
import useAppStore from "@/store/appStore";
import Navbar from "../Navbar/Navbar";

import { useEffect } from "react";

type LayoutAppProps = {
  children: React.ReactNode;
};

const LayoutApp = ({ children }: LayoutAppProps) => {
  const { fetchUser } = useAppStore((state) => state);

  useEffect(() => {
    fetchUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="row">
      <div className="col-md-12">
        <Navbar />
      </div>
      <div className="col-md-12">{children}</div>
    </section>
  );
};

export default LayoutApp;
