import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GroupDetail from './GroupDetail';
import api from '../services/api';

jest.mock('../services/api');
jest.mock('../services/auth', () => ({
  getUserId: jest.fn(() => 1)
}));

describe('GroupDetail smoke test', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    api.get.mockImplementation((url) => {
      if (url === '/groups/1') {
        return Promise.resolve({ data: { id: 1, name: 'Algo Group', userId: 1, description: 'Algorithms' } });
      }
      if (url === '/groups/1/members') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/groups/1/sessions') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/groups/1/posts') {
        return Promise.resolve({
          data: [
            {
              id: 101,
              content: 'Initial post',
              User: { id: 1, name: 'Leader' },
              Comments: [{ id: 201, content: 'Nice', User: { id: 2, name: 'Student' } }]
            }
          ]
        });
      }

      return Promise.resolve({ data: [] });
    });

    api.post.mockResolvedValue({ data: { id: 999 } });
  });

  test('renders posts/comments and submits new comment', async () => {
    render(
      <MemoryRouter initialEntries={['/groups/1']}>
        <Routes>
          <Route path="/groups/:groupId" element={<GroupDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Initial post')).toBeTruthy());
    expect(screen.getByText('Nice')).toBeTruthy();

    const input = screen.getByPlaceholderText('Add a comment');
    fireEvent.change(input, { target: { value: 'Looks good' } });
    fireEvent.click(screen.getByText('Comment'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/comments/post/101', { content: 'Looks good' });
    });
  });
});
