import {create} from 'zustand';

export const useStore = create(set => ({
  loading: false,
  setLoading: (loading: boolean) => set({loading}),
  distance: 0,
  setDistance: (distance: number) => set({distance}),
  totalTime: 0,
  setTotalTime: (totalTime: number) => set({totalTime}),
  displayBottomSheet: false,
  setDisplayBottomSheet: (displayBottomSheet: boolean) =>
    set({displayBottomSheet}),
  move: false,
  setMove: (move: boolean) => set({move}),
  readyToMove: false,
  setReadyToMove: (readyToMove: boolean) => set({readyToMove}),
  steps: {},
  setSteps: (steps: any) => {
    set({steps});
  },
}));
