export async function setPongData(dataPost) {
    try {
        const csrfToken = getCookie('csrftoken');

        const response = await fetch('/api/set_pong_result/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(dataPost),
        });
        if (!response.ok) {
            const errorData = await response.text();
            return null;
        }

        const dataReturn = await response.json();
        return dataReturn;

    } catch (error) {
        return null;
    }
}