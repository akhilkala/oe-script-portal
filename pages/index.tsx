import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useToasts } from "react-toast-notifications";
import useInputState from "../hooks/useInputState";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { BiSearch } from "react-icons/bi";
import { FiUpload } from "react-icons/fi";
import Modal from "react-modal";

const Home: NextPage = () => {
  const { addToast } = useToasts();
  const search = useInputState();

  // https://uiwjs.github.io/react-textarea-code-editor/
  // https://swiperjs.com/react
  // https://swiperjs.com/demos#effect-cards
  // https://www.npmjs.com/package/react-modal
  // https://github.com/akhilkala/Hawkeye-2021/blob/prod/client/src/components/Rulebook.tsx

  return (
    <>
      <Head>
        <title>Shell Script Portal</title>
        <meta
          name="description"
          content="Shell script portal for linux OE students"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="body">
        <header>
          <h1>Linux OE Script Portal</h1>
          <div className="left">
            <div className="input">
              <BiSearch size={22} />
              <input
                type="text"
                placeholder="Search"
                value={search.value}
                onChange={search.handleChange}
              />
            </div>
            <button>
              Upload <FiUpload />
            </button>
          </div>
        </header>
        <main>s</main>
      </div>
    </>
  );
};

export default Home;
