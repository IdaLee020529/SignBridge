import { create } from 'zustand';

interface ThemeState {
  color: string;
  updateColors: (newColors: string) => void;
}

var data = localStorage.getItem('color');

if (data !== null) {
    console.log("Data found in localStorage:", data);
} else {
    console.log("No data found in localStorage");
}

export const useTheme = create<ThemeState>((set) => ({
  color: data ?? '#1C2E4A',
  updateColors: (newColors) => set({ color: newColors }),
}));
