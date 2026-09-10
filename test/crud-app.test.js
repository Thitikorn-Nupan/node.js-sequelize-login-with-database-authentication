/**
 //  got error is i use jest as name SyntaxError: Identifier 'jest' has already been declared
 // The error occurs because Jest injects a local wrapper variable named jest into your CommonJS module scope
 How to Fix It
 Rename your variable: Change any local declaration or import named jest to something else (e.g., const { jest: myJest } = require('@jest/globals')).
 Disable injected globals: Configure Jest to turn off global injections via injectGlobals: false in your Jest Documentation configuration if you prefer importing explicit globals.
 */
import {
    beforeEach,
    describe,
    expect,
    jest as commonJest,
    test,
} from '@jest/globals';


// jest.fn() creates a mock function that records calls and can return test data.
const userFindAll = commonJest.fn();
const userCreate = commonJest.fn();
const bookFindAll = commonJest.fn();
const bcryptHash = commonJest.fn();
const bcryptCompare = commonJest.fn();


commonJest.unstable_mockModule('../services/modules.app.js', () => ({
    // Provide only the bcrypt methods used by CrudApp instead of loading real bcrypt.
    modulesApp: {
        bcrypt: {
            hash: bcryptHash,
            compare: bcryptCompare,
        },
    },
}));

commonJest.unstable_mockModule('../models/user.js', () => ({
    // Replace the Sequelize User model with controllable mock methods.
    default: {
        findAll: userFindAll,
        create: userCreate,
    },
}));

commonJest.unstable_mockModule('../models/book.js', () => ({
    // Replace Book.findAll so tests do not connect to the database.
    default: {
        findAll: bookFindAll,
    },
}));

commonJest.unstable_mockModule('../log/log.app.js', () => ({
    // Silence application logging and prevent the real Winston logger from running.
    default: {
        winstonLogging: {
            info: commonJest.fn(),
            warn: commonJest.fn(),
            debug: commonJest.fn(),
        },
    },
}));

// Import CrudApp after registering mocks so its dependencies resolve to these mocks.
const {default: CrudApp} = await import('../services/crud.app.js');

describe('jest unit test for crud.app.js', () => {
    let crudApp;
    beforeEach(() => {
        commonJest.clearAllMocks();
        crudApp = new CrudApp();
    });

    describe('test login(...)', () => {
        test('returns a success message when the password matches', async () => {
            //
            userFindAll.mockResolvedValue([{password: 'hashed-password'}]);
            bcryptCompare.mockResolvedValue(true);
            //
            await expect(crudApp.login('alice', 'password')).resolves.toBe('password user is matched');
            expect(userFindAll).toHaveBeenCalledWith({where: {username: 'alice'}});
            expect(bcryptCompare).toHaveBeenCalledWith('password', 'hashed-password');
        });

        test('returns a mismatch message when the password does not match', async () => {
            //
            userFindAll.mockResolvedValue([{password: 'hashed-password'}]);
            bcryptCompare.mockResolvedValue(false);
            //
            await expect(crudApp.login('alice', 'wrong-password')).resolves.toBe('password user hasn\'t matched');
        });

        test('returns a missing-user message when no user is found', async () => {
            //
            userFindAll.mockResolvedValue([]);
            //
            await expect(crudApp.login('alice', 'password')).resolves.toBe('user hasn\'t exited');
            expect(bcryptCompare).not.toHaveBeenCalled();
        });
    });

    describe('test createUser(...)', () => {
        test('hashes the password and creates the user', async () => {
            const createdUser = {uid: 1, username: 'alice', password: 'hashed-password'};
            //
            bcryptHash.mockResolvedValue('hashed-password');
            userCreate.mockResolvedValue(createdUser);
            //
            await expect(crudApp.createUser('alice', 'password')).resolves.toEqual(createdUser);
            expect(bcryptHash).toHaveBeenCalledWith('password', 10);
            expect(userCreate).toHaveBeenCalledWith({
                username: 'alice',
                password: 'hashed-password',
            });
        });

        test('returns false when creating the user fails', async () => {
            //
            bcryptHash.mockResolvedValue('hashed-password');
            userCreate.mockRejectedValue(new Error('database error'));
            //
            await expect(crudApp.createUser('alice', 'password')).resolves.toBe(false);
        });
    });

    describe('test loginThenGetsBooks(...)', () => {
        test('returns books after a successful login', async () => {
            const books = [
                {id: 1, name: "Clean Code",price: 1 ,sale: 1},
                {id: 2, name: "Refactoring",price: 1,sale: 2},
            ];
            //
            userFindAll.mockResolvedValue([{password: 'hashed-password'}]);
            bcryptCompare.mockResolvedValue(true);
            bookFindAll.mockResolvedValue(books);
            //
            await expect(crudApp.loginThenGetsBooks('alice', 'password')).resolves.toEqual(books);
            expect(bookFindAll).toHaveBeenCalledTimes(1);
        });

        test('returns a mismatch message when the password does not match', async () => {
            //
            userFindAll.mockResolvedValue([{password: 'hashed-password'}]);
            bcryptCompare.mockResolvedValue(false);
            //
            await expect(crudApp.loginThenGetsBooks('alice', 'wrong-password')).resolves.toBe('password user hasn\'t matched');
            expect(bookFindAll).not.toHaveBeenCalled();
        });

        test('returns a missing-user message when no user is found', async () => {
            //
            userFindAll.mockResolvedValue([]);
            //
            await expect(crudApp.loginThenGetsBooks('alice', 'password')).resolves.toBe('user hasn\'t exited');
        });
    });
});
