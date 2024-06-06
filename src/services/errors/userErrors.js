const invalidUserDataError = ({ firstName, lastName, age, email, password, role, cartId }) => {
    return `Invalid user data:
    * firstName: should be a non-empty String, received ${firstName} (${typeof firstName})
    * lastName: should be a non-empty String, received ${lastName} (${typeof lastName})
    * age: should be a positive Number, received ${age} (${typeof age})
    * email: should be a non-empty String, received ${email} (${typeof email})
    * password: should be a non-empty String, received ${password} (${typeof password})
    * role: should be a non-empty String, received ${role} (${typeof role})
    * cartId: should be a non-empty String, received ${cartId} (${typeof cartId})
    `
}

module.exports = { invalidUserDataError }