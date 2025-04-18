import {
  IconDatabase,
  IconHome,
  IconLogout,
  IconSettings,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import supabaseAdmin from "../../utils/supabase-admin";
import supabase from "../../utils/supabase";

const NavItems = () => {
  const navigate = useNavigate();

  const [style] = useState<string>(
    "hover:bg-[rgba(0,0,0,0.1)] transition-all ease-in-out cursor-pointer px-4 py-2 font-semibold flex flex-nowrap gap-4"
  );
  const [lsId, setLsId] = useState<string>(
    localStorage.getItem("sbuser") || ""
  );
  const [sbId, setSbId] = useState<string>("");

  const checkIsAdmin = async () => {
    try {
      const lsUser = localStorage.getItem("sbuser");
      const parsedLsUser = JSON.parse(lsUser!);
      const {
        data: { users },
        error,
      } = await supabaseAdmin.auth.admin.listUsers();

      setSbId(users[0].id);
      setLsId(parsedLsUser?.user?.id);
    } catch (error) {
      if (error) alert(error);
      alert(error);
    }
  };

  checkIsAdmin();

  const handleSignOut = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log(error.message);
      }
      localStorage.removeItem("sbuser");
      document.location.href = "/auth";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ol>
        <li className={style} onClick={() => navigate("/")}>
          <IconHome /> Home
        </li>
        <li className={style} onClick={() => navigate("/my-account")}>
          <IconUser /> My Account
        </li>
        {lsId === sbId ? (
          <>
            <li className={style} onClick={() => navigate("/users")}>
              <IconUsersGroup /> Users
            </li>
            <li className={style} onClick={() => navigate("/files")}>
              <IconDatabase /> Files
            </li>
            <li className={style} onClick={() => navigate("/settings")}>
              <IconSettings /> Settings
            </li>
          </>
        ) : (
          <></>
        )}
        <li className={style} onClick={handleSignOut}>
          <IconLogout /> Sign Out
        </li>
      </ol>
    </>
  );
};

export default NavItems;
