$(document).ready(function () {
  $("#publisherDropdown").change(function () {
    $("#publisher").val($(this).val());
  });
  
  $("#authorDropdown").change(function () {
    $("#author").val($(this).val());
  });
});

$("#addBook").click(function () {
  const title = $("#title").val();
  const author = $("#author").val();
  const genre = $("#genre").val();
  const publisher = $("#publisher").val();
  const year = $("#year").val();
  const types = $("input[name='type']:checked").map(function () { return $(this).val(); }).get();

  const book = { title, author, genre, publisher, year, types };

  $.ajax({
    type: "POST",
    url: "/books",
    data: JSON.stringify(book),
    contentType: "application/json",
    success: function (data) {
      $("#authorDropdown").empty();
      data.authors.forEach(author => {
        $("#authorDropdown").append(`<option>${author}</option>`);
      });

      $("#publisherDropdown").empty();
      data.publishers.forEach(publisher => {
        $("#publisherDropdown").append(`<option>${publisher}</option>`);
      });

      $("#title, #author, #publisher, #year").val("");
      $("input[name='type']").prop("checked", false);

      updateBookList();
    }
  });
});

function updateBookList() {
  $.ajax({
    type: "GET",
    url: "/books",
    success: function (books) {
      const tableBody = $("#bookList");
      tableBody.empty();

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
      tableBody.append(headerRow);

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
        tableBody.append(row);
      });
    }
  });
}