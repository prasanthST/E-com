import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


// ✅ Add this at the top of every slice file
const API_URL = import.meta.env.VITE_API_URL || '';
// Register API
export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(`${API_URL}/api/v1/register`, userData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Registeration failed. Please try again later",
      );
    }
  },
);

// Get Profile
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/profile`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load user profile",
      );
    }
  },
);

// Login User
export const login = createAsyncThunk("user/login",async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const {data} = await axios.post(`${API_URL}/api/v1/login`,{ email, password },config); 
      console.log("Login Date", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed. please try again later");
    }
  });
 // LogOut API 
    export const logout = createAsyncThunk("user/logout" ,async (_,{rejectWithValue})=>{
         try {
            const {data} = await axios.get(`${API_URL}/api/v1/logout`);
            return data;
         } catch (error) {
            return rejectWithValue(error.response?.data || "Logout failed");
         }
    })
//  Update profile
export const updateProfile = createAsyncThunk("user/updateProfile", async(userData,{rejectWithValue})=>{
  try {
    const config ={
      headers:{
        "Content-Type":"multipart/form-data",
      },
    };
    const {data} = await axios.put(`${API_URL}/api/v1/profile/update`, userData , config)
    return data ;
  } catch (error) {
    return rejectWithValue(error.response?.data || "profile update failed"); 
    
  }
})
// Update password 
export const updatePassword = createAsyncThunk("user/updatePassword", async(password,{rejectWithValue})=>{
try {
  const config= {
    headers:{
      "Content-Type":"application/json",
    }
  };
  const {data}= await axios.put(`${API_URL}/api/v1/password/update`,password,config);
  return data;
  
} catch (error) {
  return rejectWithValue(error.response?.data || "password update failed")
}
});
//Forget password
export const forgetPassword = createAsyncThunk("user/forgetpassword", async ({email},
  {rejectWithValue})=>{
try {
  const config={
    headers:{
      "Content-Type": "application/json",
    }
  }
  const {data} = await axios.post(`${API_URL}/api/v1/password/forget`,{email},config);
  return data;
} catch (error) {
  return rejectWithValue(error.response?.data || "Forget password failed");
}
})
//Reset password
export const resetPassword = createAsyncThunk("user/resetpassword",async({token,userData },{rejectWithValue})=>{
  try {
  const config={
    headers:{
      "Content-Type": "application/json",
    },
  };
  const {data} = await axios.post(`${API_URL}/api/v1/reset/${token}`,userData,config);
  return data;
} catch (error) {
  return rejectWithValue(error.response?.data || "Reset password failed");
}
} )
  
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: localStorage.getItem("isAuthenticated") == "true",
    message: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
      // state.success = false; // Set to false instead of null
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // user register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.loading = false;
        state.error = null;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        //Storage in localStorage
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem(
          "isAuthenticated",
          JSON.stringify(state.isAuthenticated),
        );
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          "Registration failed. pleasetry again later";
        state.user = null;
        state.isAuthenticated = false;
      });
    //Loading user profile
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        //store in localStorage
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem(
          "isAuthenticated",
          JSON.stringify(state.isAuthenticated),
        );
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load user Profile";
        state.user = null;
        state.isAuthenticated = false;
        // if user directly access the profile without login means
        if (action.payload?.statusCode === 401) state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      });
      //User Login
      builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        //Storage in localStorage
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem(
          "isAuthenticated",
          JSON.stringify(state.isAuthenticated),
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed. please try again later";
        state.user = null;
        state.isAuthenticated = false;
      });
      //User Logout 
      builder
      .addCase(logout.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled,(state)=>{
        state.pending = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      })
      .addCase(logout.rejected,(state, action)=>{
        state.loading = false;
        state.error = action.payload?.message || "Failed to load user profile";
      })
      //Profile Update
      builder
      .addCase(updateProfile.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled,(state,action)=>{
        state.loading = false;
        state.error = null ; 
        state.success = action.payload.success;
        state.user = action.payload?.user || state.user;
        localStorage.setItem("user",JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state,action)=>{
        state.loading = false;
        state.error = action.payload?.message || "Profile update failed";
      })
      //Updatepassword
      builder
      .addCase(updatePassword.pending,(state)=>{
        state.loading = true;
        state.error = null; 
      })
      .addCase(updatePassword.fulfilled,(state,action)=>{
        state.loading = false;
        state.error = null;
        state.success = action.payload.success; 
      })
      .addCase(updatePassword.rejected,(state,action)=>{
        state.loading = false ; 
        state.error = action.payload?.message || "Password updated failed";
      })

      //Forget Password
      builder
      .addCase(forgetPassword.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPassword.fulfilled,(state,action)=>{
        state.loading = false;
        state.error = null ;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(forgetPassword.rejected ,(state,action)=>{
        state.loading = false;
        state.error = action.payload?.message || "Forget password failed"
      }) 
      builder
      .addCase(resetPassword.pending,(state)=>{
        state.loading = true;
        state.error= null; 
      } )
      .addCase(resetPassword.fulfilled,(state,action)=>{
        state.loading = false;
        state.error=null;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.user=null;
        state.isAuthenticated=false;
      } )
      .addCase(resetPassword.rejected,(state,action)=>{
        state.loading=false;
        state.error = action.payload?.message || "Reset password failed"; 
      } )
    
  },
});
export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
