const parseRepoUrl = (url) => {
  try {
    const parts = url.replace("https://github.com/", "").split("/");
    return {
      owner: parts[0],
      repo: parts[1]
    };
  } catch {
    return null;
  }
};

export default parseRepoUrl;
