const getYearMonthDay = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return { year, month, day }
  }

  const getDate = (year,month,day) =>{
    return new Date(year,month-1,day);
  }

  export {
      getYearMonthDay,
      getDate
  }