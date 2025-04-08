from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_KEY: str
    DEBUG: bool = False
    SOLID_DEV_SERVER: str

    class Config:
        env_file = ".env"

