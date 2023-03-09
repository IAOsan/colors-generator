import { vi } from 'vitest';
import { render, setupUser, screen, waitFor } from './test-utils';
import AppContextProvider from '../context/App.context';
import ColorsContextProvider from '../context/Colors.context';
import searchParamsService from '../services/urlParams.service';
import App from '../App';

function renderApp() {
	return render(
		<AppContextProvider>
			<ColorsContextProvider>
				<App />
			</ColorsContextProvider>
		</AppContextProvider>
	);
}

const user = setupUser();
const INITIAL_COLOR = '#e8a703';
const INITIAL_RANGE = '10';
const colorOrange = '#f05454';
const colorYellow = '#D9B91A';
const colorRange50 = '50';

const scrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

describe('<App />', () => {
	const githubSource = () =>
		screen.queryByRole('link', {
			name: /view the source code in github/i,
		});
	const inputColor = () => screen.queryByPlaceholderText('Enter color');
	const inputRange = () => screen.queryByPlaceholderText('Enter color range');
	const submitButton = () =>
		screen.queryByRole('button', { name: /create colors/i });
	const colorPreview = () => document.querySelector('.color-preview');
	const colorPicker = () => document.querySelector('.color-picker');
	const colorList = (getAll) => {
		if (getAll) {
			return document.querySelectorAll('.colors');
		}
		return document.querySelector('.colors');
	};
	const removeButton = () =>
		screen.queryByRole('button', { name: /remove/i });
	const infoButton = () => screen.queryByText(/view project information/i);
	const modal = () => document.querySelector('.modal');

	async function type(element, text) {
		await user.clear(element);
		await user.type(element, text);
	}

	async function submitForm(color, weight) {
		await type(inputColor(), color);
		await type(inputRange(), weight);
		await user.click(submitButton());
	}

	function goTo(path) {
		window.history.pushState(null, '', path);
	}

	describe('LAYOUT', () => {
		it('should display a link to the source code page in the navbar', () => {
			renderApp();
			expect(githubSource()).toBeInTheDocument();
		});
		it('should display input for color', () => {
			renderApp();
			expect(inputColor()).toBeInTheDocument();
		});
		it('should display input for color weight', () => {
			renderApp();
			expect(inputRange()).toBeInTheDocument();
		});
		it('should input for color be of type text', () => {
			renderApp();
			expect(inputColor()).toHaveAttribute('type', 'text');
		});
		it('should input for color weight be of type number', () => {
			renderApp();
			expect(inputRange()).toHaveAttribute('type', 'number');
		});
		it('should display submit button for the form', () => {
			renderApp();
			expect(submitButton()).toBeInTheDocument();
		});
		it('should display color preview in the color input', () => {
			renderApp();
			expect(colorPreview()).toBeInTheDocument();
		});
		it('should not display color picker initially', async () => {
			renderApp();

			expect(colorPicker()).toBeNull();
		});
		it('should not display input feedback initially', () => {
			renderApp();
			expect(
				document.querySelectorAll('.tooltip tooltip--input-feedback')
			).toHaveLength(0);
		});
		test('should display a project information button', () => {
			renderApp();
			expect(infoButton()).toBeInTheDocument();
		});
	});
	describe('INTERACTIVITY', () => {
		it('should be able to open new tab when clicks on the github icon in the navbar', async () => {
			renderApp();

			const link = githubSource();

			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noreferrer');
			expect(link.href).toMatch(/colors-generator/i);
		});
		it('should be able to write in the input for color', async () => {
			renderApp();
			await type(inputColor(), colorOrange);
			expect(inputColor()).toHaveValue(colorOrange);
		});
		it('should update color preview when change color in input color', async () => {
			renderApp();
			await type(inputColor(), colorYellow);

			expect(colorPreview().style.cssText).toBe(
				`--previewColor: ${colorYellow};`
			);
		});
		it('should be able to write in the input for range', async () => {
			renderApp();
			await type(inputRange(), colorRange50);

			expect(inputRange()).toHaveValue(+colorRange50);
		});
		it('should display colors list of initial color when the page loads', async () => {
			renderApp();
			expect(colorList()).toBeInTheDocument();
			expect(colorList(true).length).toBe(1);
			expect(colorList().querySelectorAll('li')).toHaveLength(
				+INITIAL_RANGE * 2 + 1
			);
		});
		it('should fill the form with the initial color when page loads', () => {
			renderApp();
			expect(inputColor()).toHaveValue(INITIAL_COLOR);
			expect(inputRange()).toHaveValue(+INITIAL_RANGE);
		});
		it('should set initial color in the url params', () => {
			renderApp();
			expect(searchParamsService.entries()).toEqual([
				[`${INITIAL_COLOR.slice(1)}`, INITIAL_RANGE],
			]);
		});
		it('should display the generated color list through the form', async () => {
			renderApp();
			await submitForm(colorYellow, colorRange50);
			expect(colorList(true).length).toBe(2);
			expect(
				Array.from(colorList(true)).pop().querySelectorAll('li')
			).toHaveLength(5);
		});
		it('should set colors and weights in url params when creates colors through the form', async () => {
			renderApp();
			await submitForm(colorOrange, colorRange50);
			expect(searchParamsService.get()).toContain(
				`${colorOrange.slice(1)}=${colorRange50}`
			);
		});
		test('should scroll into the generated color list after submit the form', async () => {
			renderApp();
			await submitForm(colorYellow, colorRange50);
			await waitFor(() =>
				expect(scrollIntoViewMock).toHaveBeenCalledTimes(1)
			);
		});
		it('should restore colors from url params and create colors when page loads', async () => {
			goTo('/');
			const { rerender } = renderApp();

			expect(colorList(true)).toHaveLength(1);

			await submitForm(colorYellow, colorRange50);

			rerender(
				<AppContextProvider>
					<ColorsContextProvider>
						<App />
					</ColorsContextProvider>
				</AppContextProvider>
			);

			expect(colorList(true)).toHaveLength(2);
		});
		it('should copy hex code to the clipboard when clicks on any color box', async () => {
			renderApp();
			await submitForm(colorYellow, colorRange50);

			const colorBox = Array.from(colorList(true)).pop()
				.firstElementChild;
			await user.click(colorBox.lastElementChild.querySelector('button'));

			const clipboardText = await navigator.clipboard.readText();

			expect(clipboardText).toBe(
				colorBox.querySelector('.colors__code').textContent
			);
		});
		it('should display notification when the color is copied', async () => {
			renderApp();
			await submitForm(colorYellow, colorRange50);

			const colorBox = Array.from(colorList(true)).pop()
				.firstElementChild;
			await user.click(colorBox.lastElementChild.querySelector('button'));

			expect(
				await screen.findByText(/color copied to the clipboard!/i)
			).toBeInTheDocument();
		});
		it('should display color picker when clicks on color preview', async () => {
			renderApp();
			await user.click(colorPreview());
			expect(colorPicker()).toBeInTheDocument();
		});
		it('should display color picker with the color typed in the input color', async () => {
			renderApp();

			await type(inputColor(), colorYellow);
			await user.click(colorPreview());

			expect(screen.queryByLabelText(/hex/i)).toHaveValue(
				colorYellow.toUpperCase()
			);
		});
		it('should update color input when change color in color picker', async () => {
			renderApp();

			await user.click(colorPreview());
			await type(screen.queryByLabelText(/hex/i), colorOrange);
			await user.click(colorPreview());

			expect(inputColor()).toHaveValue(colorOrange);
		});
		it('should update color preview when change color in color picker', async () => {
			renderApp();

			await user.click(colorPreview());
			await type(screen.queryByLabelText(/hex/i), colorOrange);
			await user.click(colorPreview());

			await waitFor(() => {
				expect(colorPreview().style.cssText).toBe(
					`--previewColor: ${colorOrange};`
				);
			});
		});
		it('should hide color picker when clicks on color preview if color picker its displayed', async () => {
			renderApp();

			await user.click(colorPreview());

			expect(colorPicker()).toBeInTheDocument();

			await user.click(colorPreview());

			expect(colorPicker()).toBeNull();
		});
		it('should hide color picker when the form is submitted', async () => {
			renderApp();

			await user.click(colorPreview());
			await type(screen.queryByLabelText(/hex/i), colorOrange);
			await type(inputRange(), colorRange50);
			await user.click(submitButton());

			expect(colorPicker()).toBeNull();
		});
		it('should hide color picker when cliks on any part of the page', async () => {
			renderApp();

			await user.click(colorPreview());
			expect(colorPicker()).toBeInTheDocument();

			await user.click(document.body);
		});
		it('should colors list have remove button', async () => {
			goTo('/');
			renderApp();

			expect(removeButton()).toBeInTheDocument();
		});
		it('should delete color list when clicks on the remove button', async () => {
			goTo('/');
			renderApp();

			await user.click(removeButton());

			expect(colorList(true)).toHaveLength(0);
		});
		it('should delete color from url params when delete a color list', async () => {
			goTo('/');
			renderApp();

			await user.click(removeButton());

			expect(window.location.href).toBe(`${window.location.origin}/`);
		});
		it('should display empty message when all color lists have been cleared', async () => {
			goTo('/');
			renderApp();

			await user.click(removeButton());

			expect(colorList(true)).toHaveLength(0);
			expect(screen.queryByText(/nothing!/i)).toBeInTheDocument();
			expect(
				screen.queryByText(/your color collection is empty/i)
			).toBeInTheDocument();
		});
		test('should not display information modal initially', () => {
			renderApp();

			expect(modal()).toBeNull();
		});
		it('should display information modal when clicks on info button', async () => {
			renderApp();

			await user.click(infoButton());

			expect(modal()).toBeInTheDocument();
		});
		it('should hide information modal when clicks on info button if it is displayed', async () => {
			renderApp();

			await user.click(infoButton());
			await user.click(infoButton());

			expect(modal()).toBeNull();
		});
		it('should hide information modal when you click anywhere on the screen if it is displayed', async () => {
			renderApp();

			await user.click(infoButton());
			await user.click(document.querySelector('.overlay'));

			expect(modal()).toBeNull();
		});
	});
	describe('VALIDATIONS', () => {
		it('should display an error if the input color is empty', async () => {
			renderApp();

			await user.clear(inputColor());
			await user.clear(inputRange());
			await user.click(submitButton());
			expect(
				screen.queryByText(/"color" is not allowed to be empty/i)
			).toBeInTheDocument();
		});
		it('should display an error if the value typed in color input is not a valid color', async () => {
			renderApp();

			await submitForm('goku', '50');
			expect(
				screen.queryByText(/"Color" must be a valid color/i)
			).toBeInTheDocument();

			await submitForm('#c4c4krilin', '50');
			expect(
				screen.queryByText(/"Color" must be a valid color/i)
			).toBeInTheDocument();

			await submitForm('rgb(gohan,trunks,piccoro', '50');
			expect(
				screen.queryByText(/"color" must be a valid color/i)
			).toBeInTheDocument();
		});
		it('should display an error if the input range is empty', async () => {
			renderApp();

			await type(inputColor(), colorOrange);
			await user.clear(inputRange());
			await user.click(submitButton());

			expect(
				screen.queryByText(/"range" is not allowed to be empty/i)
			).toBeInTheDocument();
		});
		it('should display an error if the value typed in the input range is less than 1', async () => {
			renderApp();

			await submitForm(colorOrange, '-5');

			expect(
				screen.queryByText(
					/"range" must be greater than or equal to "1"/i
				)
			).toBeInTheDocument();
		});
		it('should display an error if the value typed in the range input is greater than 100', async () => {
			renderApp();

			await submitForm(colorOrange, '500');

			expect(
				screen.queryByText(
					/"range" must be less than or equal to "100"/i
				)
			).toBeInTheDocument();
		});
		it('should not generate colors if the params in the url are not valid', () => {
			goTo('holamundo=20');
			renderApp();
			expect(colorList(true)).toHaveLength(1);
		});
	});
});
