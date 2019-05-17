  //reset page after user has stopped scrolling
  /*!
 * Run a callback function after scrolling has stopped
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Function} callback The function to run after scrolling
 */
var scrollStop = function (callback) {

	// Make sure a valid callback was provided
	if (!callback || typeof callback !== 'function') return;

	// Setup scrolling variable
	var isScrolling;

	// Listen for scroll events
	window.addEventListener('scroll', function (event) {

		// Clear our timeout throughout the scroll
		window.clearTimeout(isScrolling);

		// Set a timeout to run after scrolling ends
		isScrolling = setTimeout(function() {

			// Run the callback
			callback();

		}, 180000);

	}, false);

};

const resetScrollStop = scrollStop(() => {
  window.scrollTo(0,0);
  location.reload();
});

//buttom of page that scrolls to top
const resetClick = () => {
  const scrollToTop = () => {
    window.scrollTo(0,0);
    location.reload();
  }

  document.querySelector('.handleReset').addEventListener('click', scrollToTop);
};


export { resetClick, resetScrollStop };

