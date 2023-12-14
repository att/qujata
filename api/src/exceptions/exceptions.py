class ApiException(Exception):
    def __init__(self, message, error, status_code):
        super().__init__(message)
        self.message = message
        self.error = error
        self.status_code = status_code
