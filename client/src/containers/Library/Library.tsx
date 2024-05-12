import React, { useRef, useState, useEffect } from "react";
import "./Library.css";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material"; // Import Material-UI components
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

  

  const renderSignWrapper = () => (
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
        <OrbitControls ref={controls} />
      </Canvas>
      <Button variant="contained" onClick={handleBackButtonClick}>
        Back
      </Button>
    </div>
  );

  const renderCategories = () => (
    <>
      <Typography variant="h4" gutterBottom>
        Library
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid key={category.category_id} item xs={12} sm={6} md={4} lg={3}>
            <Card onClick={() => handleCategoryClick(category.category_name)}>
              <CardContent>
                <img src={category.category_thumbnail} alt={category.category_name} style={{ maxWidth: "100%" }} />
                <Typography variant="subtitle1" align="center" className="categoryName">
                  {category.category_name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const renderSigns = () => (
    <div className="signs">
      <Typography variant="h4" gutterBottom>
        Signs
      </Typography>
      <Grid container spacing={2}>
        {signs?.map((sign, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <Card onClick={() => handleSignClick(index)}>
              <CardContent>
                <img src={sign.thumbnail} alt={sign.keyword} style={{ maxWidth: "100%" }} />
                <Typography variant="subtitle1" align="center" className="sign-keyword">
                  {sign.keyword}
                </Typography>
                <Typography variant="body2" className="sign-animations">
                  Animations: {sign.animations.join(", ")}
                </Typography>
                <Typography variant="body2" className="sign-contributor">
                  Contributor: {sign.contributor}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" onClick={() => setCurrentView(View.Categories)}>
        Back
      </Button>
    </div>
  );

  return (
    <div className="library">
      {currentView === View.Categories && renderCategories()}
      {currentView === View.Signs && renderSigns()}
      {currentView === View.SignWrapper && renderSignWrapper()}
    </div>
  );
}
