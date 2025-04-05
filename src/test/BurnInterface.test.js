import '@testing-library/jest-dom'; // Updated import for jest-dom

import { fireEvent, render, screen } from '@testing-library/react';

import BurnInterface from '../BMTverse/components/BurnInterface';
import React from 'react';

describe('BurnInterface Component', () => {
    let mockBurnTokens;
    let mockCalculateTieredReward;

    beforeEach(() => {
        mockBurnTokens = jest.fn();
        mockCalculateTieredReward = jest.fn().mockReturnValue({ baseReward: 15, bonus: 0 });
    });

    test('calls burnTokens and displays success message', async () => {
        render(<BurnInterface burnTokens={mockBurnTokens} calculateTieredReward={mockCalculateTieredReward} />);
        fireEvent.change(screen.getByPlaceholderText(/Enter amount to burn/i), { target: { value: 100 } });
        fireEvent.click(screen.getByText(/Burn Tokens/i));
        expect(typeof mockBurnTokens.mock.calls[0][0]).toBe('number');
        expect(await screen.findByText(/Successfully burned 100 tokens! You earned 15 rewards!/i)).toBeInTheDocument();
    });

    test('displays error message on burn failure', async () => {
        mockBurnTokens.mockImplementationOnce(() => { throw new Error('Burn failed'); });
        render(<BurnInterface burnTokens={mockBurnTokens} calculateTieredReward={mockCalculateTieredReward} />);
        fireEvent.change(screen.getByPlaceholderText(/Enter amount to burn/i), { target: { value: 100 } });
        fireEvent.click(screen.getByText(/Burn Tokens/i));
        expect(await screen.findByText(/Error occurred while burning tokens. Please try again./i)).toBeInTheDocument();
    });
});
