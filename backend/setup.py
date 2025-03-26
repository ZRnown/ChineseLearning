from setuptools import setup, find_packages

setup(
    name="chinese-classics-backend",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "sqlalchemy",
        "pydantic",
        "python-jose[cryptography]",
        "passlib[bcrypt]",
        "python-multipart",
        "httpx",
        "python-dotenv",
    ],
)
