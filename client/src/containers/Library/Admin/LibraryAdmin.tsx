import React, { useRef, useState, useEffect } from "react";
import "../Library.css";
import { Card, CardContent, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material"; // Import Material-UI components
import { fetchCat, fetchSign, createCat, updateCat, deleteCat, updateSign } from "../../../services/library.service";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faImage } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
// @ts-ignore
import { CharacterAnimationsProvider } from "../../../components/SLP/CharacterAnimations";
// @ts-ignore
import Experience from "../../../components/SLP/Experience";
// @ts-ignore
import Man from "../../../components/AvatarModels/Man";
import InputField from "../../../components/InputField/InputField";
import ImageInput from "../../../components/ImageInput/ImageInput";

interface LibraryCategories {
  category_name: string;
  category_thumbnail: string;
  category_id: number;
}

interface LibrarySigns {
  signId: number;  
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
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false); // State for delete confirmation dialog
  const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false); // State for update confirmation dialog
  const [openUpdateSignConfirm, setOpenUpdateSignConfirm] = useState(false); // State for update confirmation dialog
  const [cattodelete, setcattodelete] = useState<number | null>(null);
  const [cattoupdate, setcattoupdate] = useState<number | null>(null);
  const [signtoupdate, setsigntoupdate] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [resetImage, setResetImage] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");


  const [formData, setFormData] = useState({
    category_name: "",
    category_thumbnail: null,
  });

  const [signformData, setSignFormData] = useState({
    thumbnail: null,
  });


  const setCategoryThumbnail = (image: any) => {
    setFormData({ ...formData, category_thumbnail: image });
  }

  const setSignThumbnail = (image: any) => {
    setSignFormData({ ...signformData, thumbnail: image });
  }


  // Filter signs based on the search keyword
  const filteredSigns = searchKeyword.trim() === "" ? signs : signs.filter((sign) =>
    sign.keyword.toLowerCase().includes(searchKeyword.toLowerCase())
  );
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


  const handleImageReset = () => {
    setResetImage(false);
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

  const confirmDeleteCategory = async () => {
    if (cattodelete === null) return;
    try {
      await deleteCat(cattodelete);
      toast.success("Category deleted successfully");
      await fetchCategories();
    } catch (error) {
      toast.error("Error deleting FAQ");
    } finally {
      setOpenDeleteConfirm(false);
      setcattodelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      category_name: "",
      category_thumbnail: null,
    });

    setSignFormData({
      thumbnail: null,
    });
  };

  async function addCat(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.category_name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (!formData.category_thumbnail) {
      toast.error("Category image is required.");
      return;
    }

    const data = new FormData();
    data.append("category_name", formData.category_name);
    if (formData.category_thumbnail) {
      data.append("image", formData.category_thumbnail);
    } else {
      data.append("imageURL", "");
    }

    try {
      await createCat(data);
      toast.success("Category created successfully");
      await fetchCat();
    } catch (error) {
      toast.error("Error creating category");
    } finally {
      setOpen(false);
    }
  }

  async function editCat(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cattoupdate === null) return;
    if (!formData.category_name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (!formData.category_thumbnail) {
      toast.error("Category image is required.");
      return;
    }

    const data = new FormData();
    data.append("category_name", formData.category_name);
    if (formData.category_thumbnail) {
      data.append("image", formData.category_thumbnail);
    } else {
      data.append("imageURL", "");
    }

    try {
      await updateCat(cattoupdate, data);
      toast.success("Category updated successfully");
      await fetchCat();
    } catch (error) {
      toast.error("Error updating category");
    } finally {
      setOpenUpdateConfirm(false);
    }
  }

  
  async function editSign(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (signtoupdate === null) return;

    if (!signformData.thumbnail) {
      toast.error("Sign thumbnail is required.");
      return;
    }

    const data = new FormData();
    if (signformData.thumbnail) {
      data.append("image", signformData.thumbnail);
    } else {
      data.append("imageURL", "");
    }

    try {
      await updateSign(signtoupdate, data);
      toast.success("Sign thumbnail updated successfully");
      await fetchCat();
    } catch (error) {
      toast.error("Error updating sign thumbnail");
    } finally {
      setOpenUpdateSignConfirm(false);
    }
  }


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
                <img
                  src={category.category_thumbnail}
                  alt={category.category_name}
                  style={{ maxWidth: "100%" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                  }}
                >
                  <Button
                    onClick={() => {
                      setcattodelete(category.category_id);
                      setOpenDeleteConfirm(true); // Open the delete confirmation dialog
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button onClick={() => {
                    setcattoupdate(category.category_id);
                    setOpenUpdateConfirm(true);
                  }}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete confirmation dialog */}
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)}>No</Button>
          <Button onClick={confirmDeleteCategory}>Yes</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateConfirm} onClose={() => setOpenUpdateConfirm(false)}>
        <DialogTitle>Update Category</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill in the details:</DialogContentText>
          <form method="post" onSubmit={editCat}>
            <fieldset>
              <InputField
                label="Category Name"
                name="category_name"
                value={formData.category_name}
                onChange={(e) => {
                  setFormData({ ...formData, category_name: e.target.value });
                }}
                error=""
              />
            </fieldset>
            <fieldset>
              <ImageInput reset={resetImage} onReset={handleImageReset} setImageInfo={setCategoryThumbnail} />
            </fieldset>
            <div>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setOpenUpdateConfirm(false);
             resetForm(); // Reset the form details
          }}>Close</Button>
        </DialogActions>
      </Dialog>

      <>
        <Button onClick={() => setOpen(true)}>Open Create Category Dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Create Category</DialogTitle>
          <DialogContent>
            <DialogContentText>Please fill in the details:</DialogContentText>
            <form method="post" onSubmit={addCat}>
              <fieldset>
                <InputField
                  label="Category Name"
                  name="category_name"
                  value={formData.category_name}
                  onChange={(e) => {
                    setFormData({ ...formData, category_name: e.target.value });
                  }}
                  error=""
                />
              </fieldset>
              <fieldset>
                <ImageInput reset={resetImage} onReset={handleImageReset} setImageInfo={setCategoryThumbnail} />
              </fieldset>
              <div>
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setOpen(false);
               resetForm(); // Reset the form details
            }}>Close</Button>
          </DialogActions>
        </Dialog>
      </>

    </>
  );

  const renderSigns = () => (
    <div className="signs">
      <Typography variant="h4" gutterBottom>
        Signs
      </Typography>
      <input
        type="text"
        placeholder="Search by keyword..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <Grid container spacing={2}>
        {filteredSigns.map((sign, index) => (
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

                <Button onClick={() => {
                    setsigntoupdate(sign.signId);
                    setOpenUpdateSignConfirm(true);
                  }}>
                    <FontAwesomeIcon icon={faImage} />
                  </Button>
              </CardContent>
            </Card>
            <Dialog open={openUpdateSignConfirm} onClose={() => setOpenUpdateSignConfirm(false)}>
 <DialogTitle>Update Sign Thumbnail</DialogTitle>
 <DialogContent>
   <DialogContentText>Please upload an image:</DialogContentText>
   <form method="post" onSubmit={editSign}>      
     <fieldset>
       <ImageInput reset={resetImage} onReset={handleImageReset} setImageInfo={setSignThumbnail} />
     </fieldset>
     <div>
       <Button type="submit">Save</Button>
     </div>
   </form>
 </DialogContent>
 <DialogActions>
   <Button onClick={() => {setOpenUpdateSignConfirm(false);
      resetForm();
   }}>Close</Button>
 </DialogActions>
</Dialog>
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