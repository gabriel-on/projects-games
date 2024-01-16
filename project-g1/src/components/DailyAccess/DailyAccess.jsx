const setLastPointsGrantDate = () => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("lastPointsGrantDate", today);
  };
  
  const getLastPointsGrantDate = () => {
    return localStorage.getItem("lastPointsGrantDate");
  };
  
  export { setLastPointsGrantDate, getLastPointsGrantDate };
  