function createUser() {
    const randomSuffix = `${Date.now()}${Math.floor(Math.random() * 100)}`;

    return {
        name: `Usuario Teste ${randomSuffix}`,
        email: `usuario${randomSuffix}@teste.com`,
        password: '123456',
    };
}

module.exports = { createUser };
