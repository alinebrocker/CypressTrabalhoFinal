function createUser() {
    const randomSuffix = `${Date.now()}${Math.floor(Math.random() * 100)}`;

    return {
        name: `Usuario Teste ${randomSuffix}`,
        email: `usuario${randomSuffix}@teste.com`,
        password: '123456',
        dateOfBirth: {
            day: '10',
            month: '5',
            year: '1990',
        },
        firstName: `Usuario ${randomSuffix}`,
        lastName: 'Sobrenome Teste',
        company: 'Empresa Teste',
        address: 'Rua de Teste, 123',
        address2: 'Complemento Teste',
        country: 'India',
        state: 'Estado Teste',
        city: 'Cidade Teste',
        zipcode: '12345',
        mobileNumber: '1234567890',
    };
}

module.exports = { createUser };
