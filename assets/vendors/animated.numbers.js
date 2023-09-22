//#region - start of - number counter animation
const counterAnim = (qSelector) => {
	const target = document.querySelectorAll(qSelector);
	target.forEach(
		function(element) {
			let	start = parseFloat(element.getAttribute('data-anc-start')) || 0,
				end = parseFloat(element.getAttribute('data-anc-end')),
				duration = parseFloat(element.getAttribute('data-anc-duration')) || 1000;
			let startTimestamp = null;
			const step = (timestamp) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			element.innerText = Math.floor(progress * (end - start) + start).toLocaleString('en');
			if (progress < 1) {
			window.requestAnimationFrame(step);
			}
			};
			window.requestAnimationFrame(step);
		}

	);
};
//#endregion - end of - number counter animation

document.addEventListener("DOMContentLoaded", () => {
	counterAnim(".anc-counter");
	/*counterAnim("#count1");
	counterAnim("#count2");
	counterAnim("#count3");
	counterAnim("#count4");*/
});
