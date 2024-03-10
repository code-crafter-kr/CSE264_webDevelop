$(document).ready(function () {
  let books = [];
  let authors = [];
  let publishers = [];

  $("#addBook").click(function () {
    const title = $("#title").val();
    const author = $("#author").val();
    const genre = $("#genre").val();
    const publisher = $("#publisher").val();
    const year = $("#year").val();
    const types = $("input[name='type']:checked").map(function () { return $(this).val(); }).get();

    const book = { title, author, genre, publisher, year, types };
    books.push(book);

    if (!authors.includes(author)) {
      authors.push(author);
      $("#authorDropdown").append(`<option>${author}</option>`);
    }

    if (!publishers.includes(publisher)) {
      publishers.push(publisher);
      $("#publisherDropdown").append(`<option>${publisher}</option>`);
    }

    $("#title, #author, #publisher, #year").val("");
    $("input[name='type']").prop("checked", false);
  });

  $("#listBooks").click(function () {
    const tableBody = $("#bookList tbody");
    tableBody.empty();

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
  });
});