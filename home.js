let currentPage = 1;

function getRepositories() {
    const username = $('#username').val();
    const perPage = 6;
    const userUrl = `https://api.github.com/users/${username}`;
    const repoUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`;
  
    // Show loader while fetching data
    $('#repositories').empty();
    $('#loader').show();
  
    // Fetch user details
    $.ajax({
      url: userUrl,
      method: 'GET',
      success: function (user) {
        // Fetch repositories after getting user details
        $.ajax({
          url: repoUrl,
          method: 'GET',
          success: function (data, textStatus, xhr) {
            // Display repositories and user details
            displayRepositories(data);
            displayUser(user);
            handlePagination(xhr.getResponseHeader('Link'));
          },
          error: function (error) {
            $('#loader').hide();
            $('#repositories').html(`<li class="list-group-item text-danger">Error: ${error.responseJSON.message}</li>`);
          }
        });
      },
      error: function (error) {
        $('#loader').hide();
        $('#repositories').html(`<li class="list-group-item text-danger">Error: ${error.responseJSON.message}</li>`);
      }
    });
  }
  
  function displayUser(user) {
    $('#bio').html(`
      <div class="media">
        <div class="media-body1">
            <img src="${user.avatar_url}" alt="User Avatar">
        </div>
        <div class="media-body">
          <h5>${user.name || 'No Name'}</h5>
          <p>Username: ${user.login}</p>
          <p>Bio: ${user.bio || 'No bio available'}</p>
          <p>Location: ${user.location || 'No location specified'}</p>
        </div>
      </div>
    `);
  }
  

function displayRepositories(repositories) {
  $('#loader').hide();
  $('#repositories').empty();

  repositories.forEach(repo => {
    const topicsHtml = repo.topics.map(topic => `<span class="badge badge-info">${topic}</span>`).join(' ');
    $('#repositories').append(`
      <li class="list-group-item">
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description available'}</p>
        <p>${topicsHtml || 'No topics available'}</p>
      </li>
    `);
  });
}

function handlePagination(linkHeader) {
    const pagination = $('#pagination');
    const totalPages = Math.ceil(pagination.children().length );
    $('#pagination').twbsPagination({
        totalPages: 100,
        visiblePages: 10,
        onPageClick: function (event, page) {
            changePage(page)
        }
      });
}
function changePage(page) {
  currentPage = page;
  getRepositories();
}