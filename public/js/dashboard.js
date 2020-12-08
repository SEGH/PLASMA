// Set search display variables
let showTitles = false;
let showArtists = false;

// Search function to find song by its title.
$("#songSearchButton").on("click", function (event) {
    event.preventDefault();
    songClear();
    console.log("I was clicked!");
    searchTerm = $("#userSongSearchQuery").val();
    const queryURL = "/api/songSearch/" + searchTerm;

    const settings = {
        async: true,
        crossDomain: true,
        url: queryURL,
        method: "GET",

    };

    $.ajax(settings).done(function (musicData) {
        for (let i = 0; i < musicData.data.length; i++) {
            // console.log(musicData.data);
            // console.log(musicData.data[i].title);
            // console.log(musicData.data[i].artist.name);
            // console.log(musicData.data[i].album.title);

            // Get specific song information for the current index.
            const song = musicData.data[i];

            // Create the list group to contain the songs and add the song details for each.
            const $songList = $("<ul>");
            $songList.addClass("list-group");

            // Add the newly created element to the DOM.
            $("#songSearchResultsCardBody").append($songList);

            // Log and append the title of the song to $songList.
            const songTitle = song.title;
            const $songListItem = $("<li class='list-group-item songTitle'>");

            if (songTitle) {
                $songListItem.append("<h2><strong> " + songTitle + "</strong></h2>");
            }

            // Appends the respective artist name onto the page.
            const artist = song.artist.name;

            if (artist) {
                $songListItem.append("<h4>Artist: " + artist + "</h4>");
            }

            // Appends the name of the album for the song onto the page.
            const album = song.album.title;

            if (album) {
                $songListItem.append("<h4>Album: " + album + "</h4>");
            }

            // Button (to add the song to playlist) is appended.
            const addSongButton = $("<button>");
            addSongButton.text("Add Song");
            addSongButton.attr(
                "class",
                "button is-rounded is-success is-small is-light addSongBtn"
            );
            addSongButton.attr({ "data-title": songTitle, "data-artist": artist });
            addSongButton.css({ "margin-right": "10px", float: "right" });
            $songList.append(addSongButton);

            // Append the songs onto the page.
            $songList.append($songListItem);

            $songList.css({ margin: "10px" });
            $songList.css({ "padding-bottom": "20px" });
        }
        $("#userSongSearchQuery").val("");
        if (showArtists) {
            $("#artistResults").addClass("is-hidden");
            showArtists = false;
        }
        $("#titleResults").removeClass("is-hidden");
        showTitles = true;
    });
});

// Empties the list of songs from the previous searches.
function songClear() {
    $("#songSearchResultsCardBody").empty();
}

// The on "click" function that is associated with the "delete" button.
$("#songClearButton").on("click", songClear);

// Search function to find song by the artist's top songs.
$("#artistSearchButton").on("click", function (event) {
    event.preventDefault();
    artistClear();
    console.log("I was clicked!");
    searchTerm = $("#userArtistSearchQuery").val();
    const queryURL = "/api/artistSearch/" + searchTerm;


    const settings = {
        url: queryURL,
        method: "GET",
    };

    $.ajax(settings).done(function (artistData) {
        for (let i = 0; i < artistData.toptracks.track.length; i++) {
            // console.log(artistData);
            // console.log(artistData.toptracks.track[i].name);
            // console.log(artistData.toptracks.track[i].artist.name);
            // console.log(artistData.toptracks.track[i]["@attr"].rank);

            // Get specific song information for the current index.
            const song = artistData.toptracks.track[i];

            // Create the list group to contain the songs and add the song details for each.
            const $songList = $("<ul>");
            $songList.addClass("list-group");

            // Add the newly created element to the DOM.
            $("#artistSearchResultsCardBody").append($songList);

            // Log and append the title of the song to $songList.
            const songTitle = song.name;
            const $songListItem = $("<li class='list-group-item songTitle'>");

            if (songTitle) {
                $songListItem.append("<h2><strong> " + songTitle + "</strong></h2>");
            }

            // Appends the respective artist name onto the page.
            const artist = song.artist.name;

            if (artist) {
                $songListItem.append("<h4>Artist: " + artist + "</h4>");
            }

            // Appends the rank of the song onto the page.
            const rank = song["@attr"].rank;

            if (rank) {
                $songListItem.append("<h4>Song Rank: " + rank + "</h4>");
            }

            // Button (to add the song to playlist) is appended.
            const addSongButton = $("<button>");
            addSongButton.text("Add Song");
            addSongButton.attr(
                "class",
                "button is-rounded is-success is-small is-light addSongBtn"
            );
            addSongButton.attr({ "data-title": songTitle, "data-artist": artist });
            addSongButton.css({ "margin-right": "10px", float: "right" });
            $songList.append(addSongButton);

            // Append the songs onto the page.
            $songList.append($songListItem);

            $songList.css({ margin: "10px" });
            $songList.css({ "padding-bottom": "20px" });
        }
        $("#userArtistSearchQuery").val("");
        if (showTitles) {
            $("#titleResults").addClass("is-hidden");
            showTitles = false;
        }
        $("#artistResults").removeClass("is-hidden");
        showArtists = true;

    });
});

// Empties the list of songs from the previous searches.
function artistClear() {
    $("#artistSearchResultsCardBody").empty();
}

// The on "click" function that is associated with the "delete" button.
$("#artistClearButton").on("click", artistClear);

// Variables to set selected playlist and song
let selectedPlaylistName = $(".playlistListItem:first").text();
let selectedPlaylistId = $(".playlistListItem:first").data("id");
let canEditPlaylist;
let selectedSong;
let selectedArtist;
let songIsSelected = false;

// Event listener for new playlist button
$("#makePlaylistButton").on("click", function () {
    console.log("click!");
    if ($("#newPlaylistName").val() != "") {
        let playlistName = {
            name: $("#newPlaylistName").val()
        }
        $.ajax("/api/playlists", {
            type: "POST",
            data: playlistName
        }).then(function () {
            console.log("created new playlist!");
            location.reload();
        });
    }
});

// Event listener for playlist list item
$(document).on("click", ".playlistListItem", function () {
    songIsSelected = false;
    let playlistName = $(this).text();
    let playlistId = $(this).data("id");
    selectedPlaylistName = playlistName;
    selectedPlaylistId = playlistId;
    canEditPlaylist = $(this).data("editable");
    console.log(`Can edit: ${canEditPlaylist}`);
    selectPlaylist(selectedPlaylistName, selectedPlaylistId);
});

// Function to select playlist
const selectPlaylist = (name, id) => {
    if ((name === undefined) || (id === undefined)) {
        let alert = $("<h6>").text("Create a new playlist to get started!");
        $("#playlistSongsList").append(alert);
    } else {
        $("#selectedPlaylist").text(name);
        $("#selectedPlaylist").attr("data-id", id);
        renderPlaylistSongs(id);
    }
};

// Function to show other users playlists
const getOtherPlaylists = () => {

    $.ajax("/api/playlists/otherusers", {
        type: "GET"
    }).then(function (data) {
        // console.log("all user playlists");
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
            let newItem = $("<li>").text(data[i].name);
            newItem.attr({ "data-id": data[i].id });
            newItem.attr({ "data-editable": false });
            newItem.addClass("playlistListItem");
            $("#otherPlaylistsList").append(newItem);
        }
    });
}
getOtherPlaylists();

// Function to show playlist songs
const renderPlaylistSongs = (playlistId) => {
    $("#playlistSongsList").empty();
    $.ajax("/api/playlist/" + playlistId, {
        type: "GET",
        data: playlistId
    }).then(function (data) {
        console.log("displaying playlist...");
        console.log(data);
        if (data.length === 0) {
            let alert = $("<h6>").text("Add songs to your playlist by using the Find Song searchbars");
            $("#playlistSongsList").append(alert);
            selectedSong = "";
            getLyrics(selectedSong);
            $("#artistCardBody").empty();
        } else {
            data.forEach(song => {
                // console.log(song);
                let newListItem = $("<li>").text(`${song.title} by ${song.artistName}`);
                newListItem.attr({ "data-title": song.title, "data-artist": song.artistName });
                newListItem.addClass("playlistSongItem");
                $("#playlistSongsList").append(newListItem);
            });

            if (!songIsSelected) {
                selectedSong = $(".playlistSongItem:first").data("title");
                selectedArtist = $(".playlistSongItem:first").data("artist");
                getLyrics(selectedSong, selectedArtist);
                getInfo($(".playlistSongItem:first").data("title"), $(".playlistSongItem:first").data("artist"));
            }

        }
    });
};




// Event listener and function to add song
$(document).on("click", ".addSongBtn", function () {
    if (canEditPlaylist) {
        let newSong = {
            title: $(this).data("title"),
            artistName: $(this).data("artist")
        }
        // console.log("NEWSONG");
        // console.log(newSong);
        $.ajax("/api/songs", {
            type: "POST",
            data: newSong
        }).then(function (songData) {
            // console.log("SONG DATA");
            // console.log(songData);
            let newPlaylistSong = {
                PlaylistId: selectedPlaylistId,
                SongId: songData[0].id
            }
            console.log(newPlaylistSong);
            $.ajax("/api/playlistSongs", {
                type: "POST",
                data: newPlaylistSong
            }).then(function (playlistSong) {
                // console.log(playlistSong);
                let songTitleAndArtist = newSong.title + newSong.artistName;
                selectedSong = songTitleAndArtist;
                songIsSelected = true;
                renderPlaylistSongs(selectedPlaylistId);
            });
        });
    }
});

// Event listener for song name
$(document).on("click", ".playlistSongItem", function () {
    selectedSong = $(this).data("title");
    $(this).data("artist");
    var song = $(this).attr("data-title");
    var artist = $(this).attr("data-artist");
    // console.log(selectedSong);
    songIsSelected = true;
    getLyrics(selectedSong, artist);
    getInfo(song, artist);
});

// Lyric API
const getLyrics = (song, artist) => {
    $("#lyricsCardBody").empty();
    if (song === "") {
        let lyricP = $("<p>").text("Select a song to sing along!");
        $("#lyricsCardBody").append(lyricP);
    } else {
        let queryURL = `/api/lyricSearch/${song}/${artist}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (lyricData) {
            console.log(lyricData.lyrics_copyright);
            // Set them to lyric section on dashboard
            let lyricP;
            if (lyricData.lyrics_body !== "") {
                lyricP = $("<p>").text(lyricData.lyrics_body);
            } else {
                lyricP = $("<p>").text(lyricData.lyrics_copyright);
            }

            $("#lyricsCardBody").append(lyricP);
        });
    }
};

function lyricsClear() {
    $("#lyricsCardBody").empty();
}

// The on "click" function that is associated with the "delete" button.
$("#lyricsClear").on("click", lyricsClear);

const getInfo = function (song, searchTerm) {
    // console.log($(this).attr("data-artist"));
    // console.log($(this).attr("data-title"));
    const queryURL = "/api/artistInfo/" + searchTerm;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": queryURL,
        "method": "GET"
    }
    $.ajax(settings).done(function (response) {
        // console.log(response);
        // console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].title === song) {
                $("#artistCardBody").empty();
                $('#artistCardBody').append('<img id="theImg" src="' + response.data[i].album.cover_medium + '" />');

                let songTitle = $("<p>").text(response.data[i].title);
                $("#artistCardBody").append(songTitle);

                let songArtist = $("<p>").text(response.data[i].artist.name);
                $("#artistCardBody").append(songArtist);

                let songAlbum = $("<p>").text(response.data[i].album.title);
                $("#artistCardBody").append(songAlbum);

            }
        }
    });
};

function artistInfoClear() {
    $("#artistCardBody").empty();
}

// The on "click" function that is associated with the "delete" button.
$("#artistInfoClear").on("click", artistInfoClear);

// Call select playlist
selectPlaylist(selectedPlaylistName, selectedPlaylistId);
