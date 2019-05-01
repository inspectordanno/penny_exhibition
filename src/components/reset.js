export default () => {

  const scrollToTop = () => {
      window.scrollTo(0,0);
      location.reload();
    };

  document.querySelector('.handleReset').addEventListener('click', scrollToTop);
}