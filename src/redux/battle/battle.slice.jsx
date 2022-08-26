import { createSlice } from "@reduxjs/toolkit";

export const battleSlice = createSlice({
    name: "battle",
    initialState: {
        tokenID: null,
        times: 0,
        element: null,
        power: null,
        imageURL: null
    },
    reducers: {
        setPlayer(state, action) {
            const { _tokenID, _times, _element, _power, _imageURL } = action.payload
            state.tokenID = _tokenID;
            state.times = _times;
            state.element = _element;
            state.power = _power;
            state.imageURL = _imageURL;
        },
        setTimes(state, action) {
            state.times = action.payload;
        }
    }
});

export const { setTimes, setPlayer } = battleSlice.actions;

export default battleSlice.reducer;