$(document).ready(function() {
    let currentPage = 1;
    let perPage = 10;
    let totalSongs = 0;

    // if the page is loaded, fetch the list of artists
    $.ajax({
        url: '/artists',
        type: 'GET',
        success: function(data) {
            $.each(data, function(index, artist) {
                $('#artist-dropdown').append($('<option>').val(artist).text(artist));
            });
        },
        error: function() {
            console.log('Failed to fetch artist list');
        }
    });

    // if the search form is submitted, prevent the default action and fetch the songs
    $('#search-form').submit(function(event) {
        event.preventDefault();
        currentPage = 1;
        fetchSongs();
    });

    // if the page link is clicked, prevent the default action and fetch the songs
    $(document).on('click', '.page-link', function(event) {
        event.preventDefault();
        currentPage = $(this).data('page');
        fetchSongs();
    });

    // if the per page dropdown changes, update the perPage variable and fetch the songs
    $('#per-page-dropdown').change(function() {
        perPage = $(this).val();
        currentPage = 1;
        fetchSongs();
    });

    // Pull the list of songs
    function fetchSongs() {
        const artist = $('#artist-dropdown').val();
        const keyword = $('#keyword-input').val();
        $.ajax({
            url: '/songs',
            type: 'GET',
            data: {
                artist: artist,
                keyword: keyword,
                page: currentPage,
                per_page: perPage
            },
            success: function(data) {
                totalSongs = data.total;
                updateSongTable(data.songs);
                $('#per-page-dropdown').val(perPage); 
                updatePagination();
            },
            error: function() {
                console.log('Failed to fetch songs');
            }
        });
    }
    // Table Update
    function updateSongTable(songs) {
        const tableBody = $('#song-table tbody');
        tableBody.empty();
        $.each(songs, function(index, song) {
            const row = $('<tr>');
            row.append($('<td>').text(song.id));
            row.append($('<td>').text(song.title));
            row.append($('<td>').text(song.artist));
            if (song.numone) {
                row.addClass('table-primary');
            }
            tableBody.append(row);
        });
    }

    // page update
    function updatePagination() {
        const totalPages = Math.ceil(totalSongs / perPage);
        const pagination = $('.pagination');
        pagination.empty();

        if (currentPage > 1) {
            pagination.append($('<button>').addClass('page-link').data('page', currentPage - 1).text('Prev'));
        }

        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + 4);

        for (let i = start; i <= end; i++) {
            const button = $('<button>').addClass('page-link').data('page', i).text(i);
            if (i === currentPage) {
                button.addClass('active');
            }
            pagination.append(button);
        }

        if (currentPage < totalPages) {
            pagination.append($('<button>').addClass('page-link').data('page', currentPage + 1).text('Next'));
        }

        $('#song-count').text(`Songs ${(currentPage - 1) * perPage + 1} to ${Math.min(currentPage * perPage, totalSongs)} out of ${totalSongs}`);
    }
});
