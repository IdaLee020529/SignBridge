import React, { useRef, useState, useEffect } from "react";
import "./Library.css";
import { fetchCat, fetchSign } from "../../services/library.service";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
// @ts-ignore
import { CharacterAnimationsProvider } from "../../components/SLP/CharacterAnimations";
// @ts-ignore
import Experience from "../../components/SLP/Experience";
// @ts-ignore
import Man from "../../components/AvatarModels/Man";

interface LibraryCategories {
  category_name: string;
  category_thumbnail: string;
  category_id: number;
}

interface LibrarySigns {
  keyword: string;
  animations: Array<string>;
  contributor: string;
  thumbnail: string;
}

enum View {
  Categories,
  Signs,
  SignWrapper,
}

export default function Library() {
  const [categories, setCategories] = useState<LibraryCategories[]>([]);
  const [signs, setSigns] = useState<LibrarySigns[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSignIndex, setSelectedSignIndex] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.Categories);
  const [previousView, setPreviousView] = useState<View | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await fetchCat();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryClick = async (categoryName: string) => {
    try {
      const signsData = await fetchSign(categoryName);
      setSigns(signsData);
      setSelectedCategory(categoryName);
      setCurrentView(View.Signs);
    } catch (error) {
      console.error("Error fetching signs:", error);
    }
  };

  const handleSignClick = (index: number) => {
    setSelectedSignIndex(index);
    setPreviousView(currentView);
    setCurrentView(View.SignWrapper);
  };

  const handleBackButtonClick = () => {
    if (previousView !== null) {
      setCurrentView(previousView);
      setPreviousView(null);
    }
  };

  const controls = useRef();

  return (
    <div className="library">
      {currentView === View.Categories && (
        <>
          <h2 className="title">Library</h2>
          <div className="grid">
            {categories.map((category) => (
              <div key={category.category_id} className="card" onClick={() => handleCategoryClick(category.category_name)}>
                <img src={category.category_thumbnail} alt={category.category_name} className="thumbnail" />
                <div className="categoryName">{category.category_name}</div>
              </div>
            ))}
          </div>
        </>
      )}
      {currentView === View.Signs && (
        <div className="signs">
          <h2 className="title">Signs</h2>
          {signs?.map((sign, index) => (
            <div key={index} className="sign" onClick={() => handleSignClick(index)}>
              <img src={sign.thumbnail} alt={sign.keyword} className="sign-thumbnail" />
              <div className="sign-details">
                <div className="sign-keyword">{sign.keyword}</div>
                <div className="sign-animations">{sign.animations}</div>
                <div className="sign-contributor">Contributor: {sign.contributor}</div>
              </div>
            </div>
          ))}
          <button onClick={() => setCurrentView(View.Categories)}>Back</button>
        </div>
      )}
      {currentView === View.SignWrapper && (
        <div className="sign-wrapper">
          <Canvas camera={{ position: [0, 0, 225], fov: 55 }}>
            <directionalLight intensity={1} color="white" position={[10, 10, 10]} />
            <CharacterAnimationsProvider>
              <Experience />
              <Man
                animationKeyword={selectedSignIndex !== null ? signs[selectedSignIndex].keyword : ""}
                speed={""}
                showSkeleton={""}
                repeat={"Yes"}
                isPaused={""}
              />
            </CharacterAnimationsProvider>
            {/* <FPSCounter onUpdateFPS={updateFPS} /> */}
            {/*// @ts-ignore*/}
            <OrbitControls ref={controls} />
          </Canvas>
          <button onClick={handleBackButtonClick}>Back</button>
        </div>
      )}
    </div>
  );
}
