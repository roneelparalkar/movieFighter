const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {

    root.innerHTML = `
        <label><b>Search</b></label>
        <input type="text" class="input" />
        <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
        </div>
    `;

    const input = root.querySelector('input');
    const dropDown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const inputHandler = async event => {
        const items = await fetchData(event.target.value);
        if (!items.length) {
            dropDown.classList.remove('is-active');
            return;
        }
        resultsWrapper.innerHTML = '';
        dropDown.classList.add('is-active');

        for (let item of items) {
            const option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            option.addEventListener('click', () => {
                dropDown.classList.remove('is-active');
                input.value = inputValue(item);
                onOptionSelect(item);
            });
            resultsWrapper.appendChild(option);
        }
    };

    input.addEventListener('input', debounce(inputHandler, 2500));

    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropDown.classList.remove('is-active');
        }
    });
};