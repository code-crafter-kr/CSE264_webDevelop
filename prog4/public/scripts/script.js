// When the document is ready
$(document).ready(function () {
  // Handle changes in the publisher dropdown
  $("#publisherDropdown").change(function () {
    // Set the value of the publisher input field to the selected option
    $("#publisher").val($(this).val());
  });
  
  // Handle changes in the author dropdown
  $("#authorDropdown").change(function () {
    // Set the value of the author input field to the selected option
    $("#author").val($(this).val());
  });
});

// Handle the click event of the "Add Book" button
$("#addBook").click(function () {
  // Get the values of the form fields
  const title = $("#title").val();
  const author = $("#author").val();
  const genre = $("#genre").val();
  const publisher = $("#publisher").val();
  const year = $("#year").val();
  const types = $("input[name='type']:checked").map(function () { return $(this).val(); }).get();

  // Create an object with the book details
  const book = { title, author, genre, publisher, year, types };

  // Send a POST request to add the book
  $.ajax({
    type: "POST",
    url: "/books",
    data: JSON.stringify(book),
    contentType: "application/json",
    success: function (data) {
      // Update the author dropdown with the new authors
      $("#authorDropdown").empty();
      data.authors.forEach(author => {
        $("#authorDropdown").append(`<option>${author}</option>`);
      });

      // Update the publisher dropdown with the new publishers
      $("#publisherDropdown").empty();
      data.publishers.forEach(publisher => {
        $("#publisherDropdown").append(`<option>${publisher}</option>`);
      });

      // Reset the form fields
      $("#title, #author, #publisher, #year").val("");
      $("input[name='type']").prop("checked", false);

      // Update the book list
      updateBookList();
    }
  });
});

// Function to update the book list
function updateBookList() {
  // Send a GET request to retrieve all books
  $.ajax({
    type: "GET",
    url: "/books",
    success: function (books) {
      // Get the table body element
      const tableBody = $("#bookList");
      // Clear the existing table rows
      tableBody.empty();

      // Create the table header row
      const headerRow = `
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Genre</th>
          <th>Publisher</th>
          <th>Year</th>
          <th>Types</th>
        </tr>
      `;
      // Append the header row to the table body
      tableBody.append(headerRow);

      // Iterate over each book and create a table row
      books.forEach(book => {
        const row = `
          <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.publisher}</td>
            <td>${book.year}</td>
            <td>${book.types.join(", ")}</td>
          </tr>
        `;
        // Append the book row to the table body
        tableBody.append(row);
      });
    }
  });
}