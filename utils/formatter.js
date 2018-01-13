const formatErrors = (error, otherErrors) => {
  const { errors } = error;
  let objErrors = [];

  if (errors) {
    Object.entries(errors).map(errorItem => (
      objErrors.push({ path: errorItem[1].path, message: errorItem[1].message })
    ));
    objErrors = objErrors.concat(otherErrors);
    return objErrors;
  } else if (otherErrors.length) {
    return otherErrors;
  }


  const uknownError = {};
  switch (error.code) {
    case 11000:
      uknownError.path = 'username';
      uknownError.message = 'The username already exists';
      break;
    default:
      uknownError.path = 'Unknown';
      uknownError.message = error.message;
  }
  return [uknownError];
};

export default formatErrors;
