document.addEventListener('DOMContentLoaded', async () => {
  const { user } = await supabase.auth.getUserByCookie();
  if (!user) {
    alert('You must be logged in to access this page.');
    window.location.href = '/login';
  } else {
    const supabaseUrl = 'https://ythsyfvsbxedhfzeczsr.supabase.co';
    const supabaseKey = '...';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const itemsTable = document.getElementById('itemsTable');
    const addItemButton = document.getElementById('addItem');

    // Fetch items from the API and display them in the table
    async function fetchItems() {
      try {
        const response = await fetch('/items');
        const items = await response.json();
        displayItems(items);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    }

    function displayItems(items) {
      itemsTable.innerHTML = '';

      items.forEach((item) => {
        const tr = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.textContent = item.name;

        const formatTd = document.createElement('td');
        formatTd.textContent = item.format;

        const actionsTd = document.createElement('td');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'bg-yellow-500 text-white px-2 py-1 rounded mr-2';
        editBtn.addEventListener('click', () => editItem(item));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'bg-red-500 text-white px-2 py-1 rounded';
        deleteBtn.addEventListener('click', () => deleteItem(item.id));

        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(deleteBtn);

        tr.appendChild(nameTd);
        tr.appendChild(formatTd);
        tr.appendChild(actionsTd);

        itemsTable.appendChild(tr);
      });
    }

    async function deleteItem(itemId) {
      try {
        const response = await fetch(`/items/${itemId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete item');
        }

        // Refresh items
        fetchItems();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }

    function openItemModal(action, item, onSubmit) {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

      const modalContent = document.createElement('div');
      modalContent.className = 'bg-white w-96 p-4 rounded shadow-lg';

      const title = document.createElement('h2');
      title.className = 'text-2xl mb-4';
      title.textContent = `${action} Item`;

      const nameLabel = document.createElement('label');
      nameLabel.className = 'block mb-1';
      nameLabel.textContent = 'Name';

      const nameInput = document.createElement('input');
      nameInput.className = 'w-full px-2 py-1 mb-4 border border-gray-300 rounded';
      nameInput.value = item.name || '';

      const costLabel = document.createElement('label');
      costLabel.className = 'block mb-1';
      costLabel.textContent = 'Cost';

      const costInput = document.createElement('input');
      costInput.className = 'w-full px-2 py-1 mb-4 border border-gray-300 rounded';
      costInput.type = 'number';
      costInput.step = '0.01';
      costInput.value = item.cost || '';

      const formatLabel = document.createElement('label');
      formatLabel.className = 'block mb-1';
      formatLabel.textContent = 'Format';

      const formatSelect = document.createElement('select');
      formatSelect.className = 'w-full px-2 py-1 mb-4 border border-gray-300 rounded';
      formatSelect.innerHTML = '<option value="fraction">Fraction</option><option value="decimal">Decimal</option>';
      formatSelect.value = item.format || 'fraction';

      const submitBtn = document.createElement('button');
      submitBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded mr-2';
      submitBtn.textContent = action;
      submitBtn.addEventListener('click', () => {
        const newItem = {
          name: nameInput.value,
          cost: parseFloat(costInput.value),
          format: formatSelect.value,
        };
        onSubmit(newItem);
        document.body.removeChild(modal);
      });

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'bg-red-500 text-white px-4 py-2 rounded';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
      });

      modalContent.appendChild(title);
      modalContent.appendChild(nameLabel);
      modalContent.appendChild(nameInput);
      modalContent.appendChild(costLabel);
      modalContent.appendChild(costInput);
      modalContent.appendChild(formatLabel);
      modalContent.appendChild(formatSelect);
      modalContent.appendChild(submitBtn);
      modalContent.appendChild(cancelBtn);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
    }

    async function addItem(item) {
      try {
        const response = await fetch('/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          throw new Error('Failed to add item');
        }

        // Refresh items
        fetchItems();
        // ... (previous code)

      } catch (error) {
        console.error('Failed to add item:', error);
      }
    }

    function editItem(item) {
      openItemModal('Edit', item, async (updatedItem) => {
        try {
          const response = await fetch(`/items/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem),
          });

          if (!response.ok) {
            throw new Error('Failed to edit item');
          }

          // Refresh items
          fetchItems();
        } catch (error) {
          console.error('Failed to edit item:', error);
        }
      });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user.email);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });

    // Call fetchItems on page load
    fetchItems();

    // Add event listener to the "Add Item" button
    addItemButton.addEventListener('click', () => {
      openItemModal('Add', {}, addItem);
    });
  }
});