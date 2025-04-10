import { useState } from "react";
import { getFiles } from "../utils/actions";
import {
  IconArrowUp,
  IconArrowDown,
  IconLogout,
  IconChevronCompactRight,
  IconChevronCompactLeft,
} from "@tabler/icons-react";
import ResultItem from "./ResultItem";
import StartupMessage from "./StartupMessage";
import supabase from "../utils/supabase";
import NavItems from "./NavItems";

// Main page to search documents
const Home = () => {
  const [input, setInput] = useState("");
  const [data, setData] = useState<string[]>();
  const [order, setOrder] = useState("asc");
  const [userEmail] = useState<string>(
    (localStorage.length > 0 &&
      JSON.parse(localStorage.getItem("sbuser")!).user.email) ||
      ""
  );

  // State for navbar
  const [nav, setNav] = useState(false);

  // Return elements that match the user's query
  const findMatches = (sourceArr: string[], userInput: string) => {
    const pattern = new RegExp(userInput.trim(), "i");
    return userInput.length >= 2
      ? sourceArr.filter((source) => pattern.test(source))
      : [];
  };

  const handleSubmit = async () => {
    try {
      if (input.trim()) {
        const response = await getFiles();
        const filtered = findMatches(response, input);
        setData(filtered);
        if (filtered.length === 0) {
          setData(["No results found"]);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

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
      alert(error);
    }
  };

  return (
    <>
      <div className="flex flex-row h-[100vh]">
        <div className="flex flex-row">
          <button onClick={() => setNav(!nav)} className="h-1/1 bg-neutral-300">
            {nav ? (
              <IconChevronCompactLeft stroke={3} />
            ) : (
              <IconChevronCompactRight stroke={3} />
            )}
          </button>
          <div
            className={`${
              nav ? "w-[200px]" : "w-0"
            } overflow-hidden bg-neutral-200`}
          >
            <NavItems />
          </div>
        </div>
        <div className="w-full">
          {/* HEADER */}

          <div className="flex-row gap-4 flex justify-between items-center px-6 py-2 w-full">
            <div id="logo">
              <div className="flex items-baseline gap-2">
                <h3 className="font-semibold">S O P Y</h3>
                <p className="font-semibold">File Store</p>
              </div>
            </div>
            <div id="searchBarContainer" className="flex flex-row">
              <input
                id="searchBar"
                onClick={(e) => {
                  e.currentTarget.value = "";
                }}
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                className={`bg-neutral-300 outline-0 focus:border-[1px] ${
                  input.length > 0 ? "rounded-l-sm" : "rounded-sm"
                } p-2 text-sm`}
                placeholder="How to XYZ..."
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              {input && (
                <button
                  id="submitButton"
                  className={`bg-neutral-900 active:scale-95 text-white outline-0 px-4 ${
                    input.length > 0 ? "rounded-r-sm" : "rounded-sm"
                  }`}
                  onClick={() => handleSubmit()}
                >
                  Search
                </button>
              )}
              <div
                className=" flex items-center justify-center ml-4"
                title="Sign Out"
              >
                <button className="cursor-pointer" onClick={handleSignOut}>
                  <IconLogout className="inline" size={30} stroke={2} />
                </button>
              </div>
            </div>
          </div>
          <hr className="mx-4 text-neutral-400" />
          {/* MAIN BODY */}
          <div className="w-full px-4 pt-4 flex justify-end">
            {data && (
              <button
                className=" text-xs hover:-translate-y-1"
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
              >
                {order === "asc" ? (
                  <div className="flex items-center">
                    <p>Ascending</p>
                    <IconArrowUp className="inline" size={15} />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <p>Descending</p>
                    <IconArrowDown className="inline" size={15} />
                  </div>
                )}
              </button>
            )}
          </div>
          <div
            id="resultsContainer"
            className="flex flex-col items-start p-4 w-full h-[90dvh]"
          >
            {order === "asc"
              ? data?.map((item, index) => (
                  <ResultItem key={index} fileName={item} input={input} />
                ))
              : data
                  ?.slice()
                  .reverse()
                  .map((item, index) => (
                    <ResultItem key={index} fileName={item} input={input} />
                  ))}
            {data === undefined ? <StartupMessage /> : null}
          </div>
          <div className="bg-neutral-300 flex flex-row justify-between fixed bottom-0 w-full left-0">
            <div className="p-2">&copy; SOPY {new Date().getFullYear()}</div>
            <div className="p-2">User: {userEmail}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
