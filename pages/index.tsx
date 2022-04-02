import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import useInputState from "../hooks/useInputState";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { BiSearch } from "react-icons/bi";
import { FiUpload, FiGithub, FiDownload } from "react-icons/fi";
import Modal from "react-modal";
import Dropzone from "react-dropzone";
import { useLottie } from "lottie-react";
import loadingAnimation from "../public/loading.json";
import { useMediaQuery } from "react-responsive";

type IScript = {
  id: string;
  name: string;
  author: string;
  description: string;
  fileUrl: string;
};

const options = {
  animationData: loadingAnimation,
  loop: true,
  autoplay: true,
};

const Home: NextPage = () => {
  const { addToast } = useToasts();
  const search = useInputState();
  const [modalOpen, setModalOpen] = useState(false);
  const [scripts, setScripts] = useState<IScript[]>([]);

  const [file, setFile] = useState<File | null>(null);

  const author = useInputState();
  const name = useInputState();
  const description = useInputState();
  const [wordCount, setWordCount] = useState(0);

  const isMobile = useMediaQuery({
    query: "(max-width: 600px)",
  });

  const { View: LoadingView } = useLottie(options, {
    height: 500,
    width: 500,
  });

  const [loading, setLoading] = useState(false);

  const [mainLoading, setMainLoading] = useState(true);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "scripts"));
    const data: any[] = [];
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setScripts(data);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchData();
        setMainLoading(false);
        author.set(localStorage.getItem("author") || "");
      } catch (err) {
        setMainLoading(false);
        addToast("Something went wrong!", { appearance: "error" });
      }
    })();
  }, []);

  const getFilteredScripts = () => {
    return scripts.filter((script: any) => {
      const searchTerm = script.name + " " + script.author;
      return searchTerm.toLowerCase().includes(search.value.toLowerCase());
    });
  };

  const handleSubmit = async () => {
    if (!author.value || !description.value || !name.value) {
      addToast("All fields are required", { appearance: "error" });
      return;
    }

    if (!file) {
      addToast("Script is required", { appearance: "error" });
      return;
    }

    if (author.value.length > 15) {
      addToast("Author name is too long", { appearance: "error" });
      return;
    }

    if (name.value.length > 15) {
      addToast("Script name is too long", { appearance: "error" });
      return;
    }

    try {
      setLoading(true);

      const fileName = "scripts/" + file.name + Date.now().toString();
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(ref(storage, fileName));

      await addDoc(collection(db, "scripts"), {
        name: name.value,
        author: author.value,
        description: description.value,
        fileUrl: url,
      });

      setLoading(false);
      setModalOpen(false);
      addToast("Script added successfully", { appearance: "success" });
      localStorage.setItem("author", author.value);
      await fetchData();
      name.handleReset();
      author.handleReset();
      description.handleReset();
      setFile(null);
    } catch (e) {
      setModalOpen(false);
      setLoading(false);
      addToast("Something went wrong!", { appearance: "error" });
    }
  };

  if (isMobile) {
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
        <div className="mobile">
          <h1>Not available on mobile :(</h1>
        </div>
      </>
    );
  }

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
        <a
          href="https://github.com/akhilkala/oe-script-portal"
          className="repo-link"
        >
          <FiGithub size={15} color="#212121" />
        </a>
        <header>
          <h1>Shell Script Portal</h1>
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
            <button onClick={() => setModalOpen(true)}>
              Upload <FiUpload />
            </button>
          </div>
        </header>
        <main>
          {mainLoading && <div className="main-loading">{LoadingView}</div>}
          {getFilteredScripts().map((script: IScript) => (
            <div key={script.id} className="script">
              <a href={script.fileUrl} download className="download">
                <FiDownload size={15} color="#121212" />
              </a>
              <h2>{script.name}</h2>
              <h3>Authored by: {script.author}</h3>
              <p>{script.description}</p>
            </div>
          ))}
        </main>
        <footer>
          Made with <span>{"<3"}</span> by{" "}
          <a href="https://akhilkala.com/">Akhil Kala</a>
        </footer>
      </div>
      <Modal
        onRequestClose={() => setModalOpen(false)}
        className={`modal ${loading && "modal-loading"}`}
        overlayClassName="overlay"
        isOpen={modalOpen}
      >
        {!loading && (
          <>
            <div className="content">
              <div className="left">
                <div className="input">
                  <label htmlFor="name">Script Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name.value}
                    onChange={name.handleChange}
                  />
                </div>
                <div className="input">
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    id="author"
                    value={author.value}
                    onChange={author.handleChange}
                  />
                </div>
                <div className="input">
                  <label className="disc-label" htmlFor="description">
                    Description <span>{`${wordCount} / 100`}</span>
                  </label>
                  <textarea
                    id="description"
                    value={description.value}
                    onChange={(e) => {
                      description.handleChange(e);
                      setWordCount(e.target.value.length);
                    }}
                    placeholder="Add comments for a detailed description"
                    maxLength={100}
                  />
                </div>
              </div>
              <div className="right">
                {!!file ? (
                  <div className="dropzone dropzone--file">
                    <p>{file.name} is selected</p>
                    <div className="btn" onClick={() => setFile(null)}>
                      Remove
                    </div>
                  </div>
                ) : (
                  <Dropzone
                    onDrop={(files) => {
                      if (files[0].type !== "text/x-sh")
                        return addToast("Not a .sh file", {
                          appearance: "error",
                        });
                      setFile(files[0]);
                      console.log(files[0]);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <p>
                          Drop script <br />
                          <span>- OR -</span>
                          <br /> Click to select file
                        </p>
                      </div>
                    )}
                  </Dropzone>
                )}
              </div>
            </div>
            <button onClick={handleSubmit}>Submit</button>
          </>
        )}
        <div className={`loading ${loading && "loading-visible"}`}>
          {LoadingView}
        </div>
      </Modal>
    </>
  );
};

export default Home;
